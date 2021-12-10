import React, { useCallback, useEffect, useState, useRef } from 'react';
import { makeStyles, Paper, TableCell, Button, Tooltip } from '@material-ui/core';
import {
  Check,
  Close,
  Remove,
  ShoppingBasket as ShoppingBasketIcon,
} from '@material-ui/icons';
import PageHeader from '../components/Admin/PageHeader';
import Command from '../models/Command.model';
import { } from '../services/commands';
import { useSnackbar } from 'notistack';
import EventEmitter from '../services/EventEmitter';
import useDeleteSelection from '../hooks/useDeleteSelection';
import NumberFormatter from '../utils/NumberFormatter';
import DateFormatter from '../utils/DateFormatter';
import PriceFormatter from '../utils/PriceFormatter';
import moment from 'moment';
import { useAuth } from '../providers/authentication';
import PDFButton from '../components/Common/PDFButton';
import { useHistory } from 'react-router';
import ShowButton from '../components/Common/ShowButton';
import CommandDetailsDialog from '../components/Common/CommandDetailsDialog';
import TableContainer, { HeadCell } from '../components/Table/TableContainer';
import { Loading } from '../components/Common';
import { estimateCommandPrice } from '../services/price';
import { useDispatch } from 'react-redux';
import { useSelector } from '../utils/redux';
import { getAllCommands } from '../actions/commandes.action';
import { revokeCommand, validateCommand, deleteCommand, toValidate, toRefuseAll, CommandLivre, CommandAllLivre } from '../services/commands';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import SendNotification from '../services/SendNotification';
import { getCommandCount } from '../services/commands';


const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));

const headCells: HeadCell<Command>[] = [
  {
    id: 'code',
    label: 'Numéro de commande',
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
  },
  {
    id: 'createdAt',
    label: 'Date de la commande',
  },
  {
    id: 'shippingTime',
    label: ' Date de retrait',
  },
  {
    id: 'totalPrice',
    label: 'Montant total',
  },
  {
    id: 'hasDelivery',
    label: 'Emporté',
  },
  {
    id: 'validated',
    label: 'Validation',
  },
];

const TakeawayCommandList: React.FC = () => {
  const classes = useStyles();
  const { isRestaurantAdmin, restaurant } = useAuth();

  const dispatch = useDispatch();

  const { data, isLoaded }: any = useSelector(({ commands }: any) => ({
    data: commands.takeaway,
    isLoaded: commands.isLoaded
  }));

  const interval = useRef<number>();

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
    },
  );

  useEffect(
    () => {
      setRecords(data);
    },
    [data]
  )

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(getAllCommands(isRestaurantAdmin ? restaurant?._id || '' : undefined));
      setLoading(false);
    } catch (e) {
      enqueueSnackbar('Erreur lors du chargement...', {
        variant: 'error',
      });
    }
  }, [enqueueSnackbar, isRestaurantAdmin, restaurant, dispatch]);

  const history = useHistory();

  const downloadPDF = useCallback(
    (id: string) => {
      history.push(`/pdf-command/${id}`);
    },
    [history],
  );

  useEffect(() => {
    const onRefresh = () => {
      fetch();
    };

    EventEmitter.on('REFRESH', onRefresh);

    return () => {
      EventEmitter.removeListener('REFRESH', onRefresh);
    };
  }, [fetch]);

  useEffect(() => {
    if (!isLoaded) {
      fetch();
    }
  }, [fetch, isLoaded]);

  // useEffect(() => {

  //   interval.current = window.setInterval(fetch, 15000);

  //   getCommandCount('takeaway', {
  //     restaurant: isRestaurantAdmin ? restaurant?._id || '' : undefined,
  //     validated: false,
  //   }).then((data) => {

  //     const nbr = sessionStorage.getItem("takeaway") || 0;

  //     if (nbr !== data) {

  //       fetch();

  //     }

  //   });

  //   return () => window.clearInterval(interval.current);

  // }, [fetch]);

  const toValidateAll = () => {

    setUpdating(true);

    toValidate(selected)
      .then((res: any) => {

        SendNotification({
          title: "Commande validé",
          body: "Votre commande a été validé",
          isRedirectAdmin: false,
          to: res.tokenNavigator
        })

      })
      .finally(() => {
        EventEmitter.emit('REFRESH_NAVIGATION_BAR');
        setUpdating(false);
        setSelected([])
        fetch();
      });

  }

  const toRefuseAllSelected = () => {

    setUpdating(true);

    toRefuseAll(selected)
      .then((res: any) => {

        SendNotification({
          title: "Commande refusé",
          body: "Votre commande a été refusé",
          isRedirectAdmin: false,
          to: res.tokenNavigator
        })

      })
      .finally(() => {
        EventEmitter.emit('REFRESH_NAVIGATION_BAR');
        setUpdating(false);
        setSelected([])
        fetch();
      });

  }

  const Emporter = (_id: any) => {

    CommandLivre(_id)
      .then(() => {

        enqueueSnackbar('Commande emportée', {
          variant: 'success',
        });

        EventEmitter.emit('REFRESH_NAVIGATION_BAR');
        setUpdating(false);
        setSelected([])
        fetch();

      })
      .catch(() => {
        enqueueSnackbar('Erreur lors de la validation', {
          variant: 'error',
        });
      });
  }

  const EmporteAll = () => {
    CommandAllLivre(selected)
      .then(() => {
        enqueueSnackbar('Commande emportée', {
          variant: 'success',
        });

        EventEmitter.emit('REFRESH_NAVIGATION_BAR');
        setUpdating(false);
        setSelected([])
        fetch();
      })
      .catch(() => {
        enqueueSnackbar('Erreur lors de la validation', {
          variant: 'error',
        });
      });
  }

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
              EventEmitter.emit('REFRESH_NAVIGATION_BAR');
              setUpdating(false);
            });
          }}
          loading={loading}
          emptyPlaceholder="Aucune commande"
          selected={selected}
          onSelectedChange={setSelected}
          records={records}
          headCells={headCells}
          options={{
            order: 'desc',
            orderBy: 'code',
            hasActionsColumn: true,
            filters: [
              {
                id: 'code',
                label: 'Numero de commande',
                type: 'NUMBER',
              },
              {
                id: 'restaurant',
                label: 'Restaurant',
                type: 'RESTAURANT',
                alwaysOn: isRestaurantAdmin ? false : true,
              },
              {
                id: 'createdAt',
                label: 'Date',
                type: 'DATE',
                alwaysOn: true,
              },
              {
                id: 'validated',
                label: 'Validé',
                type: 'BOOLEAN',
              },
              {
                id: 'commandType',
                label: 'Type',
                type: 'COMMAND_TYPE',
              },
            ],
            selectOnClick: false,
            onRowClick: (_, command) => setSelectedCommand(command),
            customComparators: {
              restaurant: (a, b) =>
                b.restaurant.name.localeCompare(a.restaurant.name),
              createdAt: (a, b) =>
                moment(a.createdAt).diff(b.createdAt, 'days'),
            },
          }}
        >
          {(command) => {
            const { _id, code, restaurant, createdAt, validated, revoked, shippingTime, hasDelivery } =
              command;

            return (
              <>
                <TableCell
                  style={{
                    fontWeight: !validated && !revoked ? 'bold' : undefined,
                  }}
                >
                  {NumberFormatter.format(code, { minimumIntegerDigits: 5 })}
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: !validated && !revoked ? 'bold' : undefined,
                  }}
                >
                  {restaurant.name}
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: !validated && !revoked ? 'bold' : undefined,
                  }}
                >
                  {DateFormatter.format(createdAt)}
                </TableCell>

                <TableCell
                  style={{
                    fontWeight: !validated && !revoked ? 'bold' : undefined,
                  }}
                >
                  {DateFormatter.format(shippingTime)}
                </TableCell>


                <TableCell
                  style={{
                    fontWeight: !validated && !revoked ? 'bold' : undefined,
                  }}
                >
                  {PriceFormatter.format({
                    amount: command.totalPrice,
                    currency: 'eur',
                  })}
                </TableCell>

                <TableCell
                  style={{
                    fontWeight: !hasDelivery ? 'bold' : undefined,
                  }}
                >
                  {hasDelivery ? (
                    <Check htmlColor="green" />
                  ) : (
                    <Close htmlColor="red" />
                  )}
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: !validated && !revoked ? 'bold' : undefined,
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

                  {
                    !hasDelivery && (
                      <Tooltip title="Emporté">

                        <Button
                          variant="contained"
                          style={{
                            minWidth: 'fit-content',
                            borderRadius: 4,
                            padding: 6,
                            margin: 4,
                            backgroundColor: 'orange',
                            color: 'white'
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
                    )
                  }
                  {!command.validated &&
                    (<>
                      <Tooltip title="Valider">

                        <Button
                          variant="contained"
                          style={{
                            minWidth: 'fit-content',
                            borderRadius: 4,
                            padding: 6,
                            margin: 4,
                            backgroundColor: 'green',
                            color: 'white'
                          }}
                          onClick={(e: any) => {

                            e.stopPropagation();
                            e.preventDefault();

                            command &&
                              validateCommand(command._id)
                                .then((res: any) => {

                                  enqueueSnackbar('Commande validée', {
                                    variant: 'success',
                                  });

                                  SendNotification({
                                    title: "Commande validée",
                                    body: "Votre Commande a été validée",
                                    isRedirectAdmin: false,
                                    to: new Array(res.data.tokenNavigator)
                                  });

                                  setRecords(records.map((item: any) => {

                                    if (command._id === item._id) {
                                      return {
                                        ...item,
                                        validated: true
                                      }

                                    }

                                    return item

                                  }));

                                  EventEmitter.emit('REFRESH_NAVIGATION_BAR');

                                })
                                .catch(() => {
                                  enqueueSnackbar('Erreur lors de la validation', {
                                    variant: 'error',
                                  });
                                });
                          }}
                        >
                          <CheckIcon />

                        </Button>
                      </Tooltip>
                      {!revoked && (<Tooltip title="Refuser">

                        <Button
                          color="primary"
                          variant="contained"
                          style={{
                            minWidth: 'fit-content',
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

                                  enqueueSnackbar('Commande refusée', {
                                    variant: 'info',
                                  });

                                  SendNotification({
                                    title: "Commande refusée",
                                    body: "Votre commande a été refusée ",
                                    isRedirectAdmin: false,
                                    to: new Array(res.data.tokenNavigator)
                                  })

                                  setRecords(records.map((item: any) => {

                                    if (command._id === item._id) {
                                      return {
                                        ...item,
                                        revoked: true
                                      }

                                    }

                                    return item

                                  }))
                                  EventEmitter.emit('REFRESH_NAVIGATION_BAR');
                                })
                                .catch(() => {
                                  enqueueSnackbar(
                                    'Erreur lors du refus de la commande',
                                    {
                                      variant: 'error',
                                    },
                                  );
                                });
                          }}
                        >
                          <ClearIcon />

                        </Button>
                      </Tooltip>
                      )}
                    </>)}
                  <PDFButton
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadPDF(_id);
                    }}
                  />
                </TableCell>
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
