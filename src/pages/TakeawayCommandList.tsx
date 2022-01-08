import React, { useCallback, useEffect, useState } from "react";
import {
  makeStyles,
  Paper,
  TableCell,
  Button,
  Tooltip,
  useMediaQuery,
  Theme,
} from "@material-ui/core";
import {
  Check,
  Close,
  Remove,
  ShoppingBasket as ShoppingBasketIcon,
} from "@material-ui/icons";
import PageHeader from "../components/Admin/PageHeader";
import Command from "../models/Command.model";
import { useSnackbar } from "notistack";
import EventEmitter from "../services/EventEmitter";
import useDeleteSelection from "../hooks/useDeleteSelection";
import NumberFormatter from "../utils/NumberFormatter";
import DateFormatter from "../utils/DateFormatter";
import PriceFormatter from "../utils/PriceFormatter";
import moment from "moment";
import { useAuth } from "../providers/authentication";
import PDFButton from "../components/Common/PDFButton";
import { useHistory } from "react-router";
import ShowButton from "../components/Common/ShowButton";
import CommandDetailsDialog from "../components/Common/CommandDetailsDialog";
import TableContainer, { HeadCell } from "../components/Table/TableContainer";
import { Loading } from "../components/Common";
import { useDispatch } from "react-redux";
import { useSelector } from "../utils/redux";
import { getAllCommands } from "../actions/commandes.action";
import {
  revokeCommand,
  validateCommand,
  deleteCommand,
  toValidate,
  toRefuseAll,
  CommandLivre,
  CommandAllLivre,
} from "../services/commands";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  textHead: {
    fontSize: "1.25vh",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1vh",
    },
  },
}));

const headCells: HeadCell<Command>[] = [
  {
    id: "code",
    label: "Numéro de commande",
  },
  {
    id: "restaurant",
    label: "Restaurant",
  },
  {
    id: "createdAt",
    label: "Date de la commande",
  },
  {
    id: "shippingTime",
    label: " Date de retrait",
  },
  {
    id: "totalPrice",
    label: "Montant total",
  },
  {
    id: "hasDelivery",
    label: "Emporté",
  },
  {
    id: "validated",
    label: "Validation",
  },
];

const headCellsMobil: HeadCell<Command>[] = [
  {
    id: "code",
    label: "Numéro de commande",
  },
  {
    id: "shippingTime",
    label: " Date de retrait",
  },
  {
    id: "totalPrice",
    label: "Montant total",
  },
];

const TakeawayCommandList: React.FC = () => {
  const classes = useStyles();

  const { isRestaurantAdmin, restaurant } = useAuth();

  const dispatch = useDispatch();

  const { data, isLoaded }: any = useSelector(({ commands }: any) => ({
    data: commands.takeaway,
    isLoaded: commands.isLoaded,
  }));

  const [records, setRecords] = useState<Command[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedCommand, setSelectedCommand] = useState<Command>();
  const [updating, setUpdating] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();
  const { handleDeleteSelection } = useDeleteSelection(
    deleteCommand,
    selected,
    {
      onDeleteRecord: (id) =>
        setRecords((v) => v.filter(({ _id }) => _id !== id)),
    }
  );

  useEffect(() => {
    setRecords(data);
  }, [data]);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(
        getAllCommands(isRestaurantAdmin ? restaurant?._id || "" : undefined)
      );
      setLoading(false);
    } catch (e) {
      enqueueSnackbar("Erreur lors du chargement...", {
        variant: "error",
      });
    }
  }, [enqueueSnackbar, isRestaurantAdmin, restaurant, dispatch]);

  const history = useHistory();

  const downloadPDF = useCallback(
    (id: string) => {
      history.push(`/pdf-command/${id}`);
    },
    [history]
  );

  useEffect(() => {
    const onRefresh = () => {
      fetch();
    };

    EventEmitter.on("REFRESH", onRefresh);

    return () => {
      EventEmitter.removeListener("REFRESH", onRefresh);
    };
  }, [fetch]);

  useEffect(() => {
    if (!isLoaded) {
      fetch();
    }
  }, [fetch, isLoaded]);

  const toValidateAll = () => {
    
    setUpdating(true);

    toValidate(selected)
      .then((res: any) => {

        enqueueSnackbar("Commande validée", {
          variant: "success",
        });

      })
      .finally(() => {
        EventEmitter.emit("REFRESH_NAVIGATION_BAR");
        setUpdating(false);
        setSelected([]);
        fetch();
      });
  };

  const toRefuseAllSelected = () => {
    setUpdating(true);

    toRefuseAll(selected)
      .then((res: any) => {

        enqueueSnackbar("Commande refusée", {
          variant: "success",
        });

      })
      .finally(() => {
        EventEmitter.emit("REFRESH_NAVIGATION_BAR");
        setUpdating(false);
        setSelected([]);
        fetch();
      });
  };

  const Emporter = (_id: any) => {
    CommandLivre(_id)
      .then(() => {
        enqueueSnackbar("Commande emportée", {
          variant: "success",
        });

        EventEmitter.emit("REFRESH_NAVIGATION_BAR");
        setUpdating(false);
        setSelected([]);
        fetch();
      })
      .catch(() => {
        enqueueSnackbar("Erreur lors de la validation", {
          variant: "error",
        });
      });
  };

  const EmporteAll = () => {
    CommandAllLivre(selected)
      .then(() => {
        enqueueSnackbar("Commande emportée", {
          variant: "success",
        });

        EventEmitter.emit("REFRESH_NAVIGATION_BAR");
        setUpdating(false);
        setSelected([]);
        fetch();
      })
      .catch(() => {
        enqueueSnackbar("Erreur lors de la validation", {
          variant: "error",
        });
      });
  };

  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  return (
    <>
      <PageHeader
        icon={ShoppingBasketIcon}
        title="Commandes"
        subTitle="Liste des commandes à emporter"
      />
      <Paper className={classes.root}>
        <TableContainer
          showAddButton={false}
          toRefuseAll={toRefuseAllSelected}
          toValidateAll={toValidateAll}
          EmporteAll={EmporteAll}
          onDeleteClick={() => {
            setUpdating(true);
            handleDeleteSelection().finally(() => {
              EventEmitter.emit("REFRESH_NAVIGATION_BAR");
              setUpdating(false);
            });
          }}
          loading={loading}
          emptyPlaceholder="Aucune commande"
          selected={selected}
          onSelectedChange={setSelected}
          records={records}
          headCells={mdUp ? headCells : headCellsMobil}
          options={{
            order: "desc",
            orderBy: "code",
            hasActionsColumn: true,
            filters: [
              {
                id: "code",
                label: "Numero de commande",
                type: "NUMBER",
              },
              {
                id: "restaurant",
                label: "Restaurant",
                type: "RESTAURANT",
                alwaysOn: isRestaurantAdmin ? false : true,
              },
              {
                id: "createdAt",
                label: "Date",
                type: "DATE",
                alwaysOn: true,
              },
              {
                id: "validated",
                label: "Validé",
                type: "BOOLEAN",
              },
              {
                id: "commandType",
                label: "Type",
                type: "COMMAND_TYPE",
              },
            ],
            selectOnClick: false,
            onRowClick: (_, command) => setSelectedCommand(command),
            customComparators: {
              restaurant: (a, b) =>
                b.restaurant.name.localeCompare(a.restaurant.name),
              createdAt: (a, b) =>
                moment(a.createdAt).diff(b.createdAt, "days"),
            },
          }}
        >
          {(command) => {
            const {
              _id,
              code,
              restaurant,
              createdAt,
              validated,
              revoked,
              shippingTime,
              hasDelivery,
              shipAsSoonAsPossible,
            } = command;

            return (
              <>
                <TableCell
                  className={classes.textHead}
                  style={{
                    fontWeight: !validated && !revoked ? "bold" : undefined,
                  }}
                >
                  {`${NumberFormatter.format(code, {
                    minimumIntegerDigits: 5,
                  })} `}
                </TableCell>
                {mdUp && (
                  <>
                    <TableCell
                      className={classes.textHead}
                      style={{
                        fontWeight: !validated && !revoked ? "bold" : undefined,
                      }}
                    >
                      {restaurant.name}
                    </TableCell>
                    <TableCell
                      className={classes.textHead}
                      style={{
                        fontWeight: !validated && !revoked ? "bold" : undefined,
                      }}
                    >
                      {DateFormatter.format(createdAt)}
                    </TableCell>
                  </>
                )}

                <TableCell
                  className={classes.textHead}
                  style={{
                    fontWeight: !validated && !revoked ? "bold" : undefined,
                  }}
                >
                  {shipAsSoonAsPossible
                    ? "le plus tôt possible"
                    : DateFormatter.format(shippingTime,true)}
                </TableCell>

                <TableCell
                  className={classes.textHead}
                  style={{
                    fontWeight: !validated && !revoked ? "bold" : undefined,
                  }}
                >
                  {PriceFormatter.format({
                    amount: command.totalPrice,
                    currency: "eur",
                  })}
                </TableCell>

                {mdUp && (
                  <>
                    {" "}
                    <TableCell
                      className={classes.textHead}
                      style={{
                        fontWeight: !hasDelivery ? "bold" : undefined,
                      }}
                    >
                      {hasDelivery ? (
                        <Check htmlColor="green" />
                      ) : (
                        <Close htmlColor="red" />
                      )}
                    </TableCell>
                    <TableCell
                      className={classes.textHead}
                      style={{
                        fontWeight: !validated && !revoked ? "bold" : undefined,
                      }}
                    >
                      {validated ? (
                        <Check htmlColor="green" />
                      ) : revoked ? (
                        <Close htmlColor="red" />
                      ) : (
                        <Remove />
                      )}
                    </TableCell>
                    <TableCell>
                      <ShowButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCommand(command);
                        }}
                      />

                      {!hasDelivery && (
                        <Tooltip title="Emporté">
                          <Button
                            variant="contained"
                            style={{
                              minWidth: "fit-content",
                              borderRadius: 4,
                              padding: 6,
                              margin: 4,
                              backgroundColor: "orange",
                              color: "white",
                            }}
                            onClick={(e: any) => {
                              e.stopPropagation();
                              e.preventDefault();

                              Emporter(command._id);
                            }}
                          >
                            <DirectionsRunIcon />
                          </Button>
                        </Tooltip>
                      )}
                      {!command.validated && (
                        <>
                          <Tooltip title="Valider">
                            <Button
                              variant="contained"
                              style={{
                                minWidth: "fit-content",
                                borderRadius: 4,
                                padding: 6,
                                margin: 4,
                                backgroundColor: "green",
                                color: "white",
                              }}
                              onClick={(e: any) => {
                                e.stopPropagation();
                                e.preventDefault();

                                command &&
                                  validateCommand(command._id)
                                    .then((res: any) => {

                                      enqueueSnackbar("Commande validée", {
                                        variant: "success",
                                      });

                                      setRecords(
                                        records.map((item: any) => {
                                          if (command._id === item._id) {
                                            return {
                                              ...item,
                                              validated: true,
                                            };
                                          }

                                          return item;
                                        })
                                      );

                                      EventEmitter.emit(
                                        "REFRESH_NAVIGATION_BAR"
                                      );
                                    })
                                    .catch(() => {
                                      enqueueSnackbar(
                                        "Erreur lors de la validation",
                                        {
                                          variant: "error",
                                        }
                                      );
                                    });
                              }}
                            >
                              <CheckIcon />
                            </Button>
                          </Tooltip>
                          {!revoked && (
                            <Tooltip title="Refuser">
                              <Button
                                color="primary"
                                variant="contained"
                                style={{
                                  minWidth: "fit-content",
                                  borderRadius: 4,
                                  padding: 6,
                                  margin: 4,
                                }}
                                onClick={(e: any) => {
                                  e.stopPropagation();
                                  e.preventDefault();

                                  command &&
                                    revokeCommand(command._id)
                                      .then((res: any) => {

                                        enqueueSnackbar("Commande refusée", {
                                          variant: "info",
                                        });

                                        setRecords(
                                          records.map((item: any) => {
                                            if (command._id === item._id) {
                                              return {
                                                ...item,
                                                revoked: true,
                                              };
                                            }

                                            return item;
                                          })
                                        );
                                        EventEmitter.emit(
                                          "REFRESH_NAVIGATION_BAR"
                                        );
                                      })
                                      .catch(() => {
                                        enqueueSnackbar(
                                          "Erreur lors du refus de la commande",
                                          {
                                            variant: "error",
                                          }
                                        );
                                      });
                                }}
                              >
                                <ClearIcon />
                              </Button>
                            </Tooltip>
                          )}
                        </>
                      )}
                      <PDFButton
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadPDF(_id);
                        }}
                      />
                    </TableCell>
                  </>
                )}
              </>
            );
          }}
        </TableContainer>
      </Paper>

      <CommandDetailsDialog
        open={!!selectedCommand}
        command={selectedCommand}
        onClose={() => setSelectedCommand(undefined)}
      />

      <Loading
        open={updating}
        semiTransparent
        backgroundColor="rgba(0, 0, 0, .7)"
      />
    </>
  );
};

export default TakeawayCommandList;
