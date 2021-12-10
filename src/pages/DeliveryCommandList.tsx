import React, { useCallback, useEffect, useState, useRef } from 'react';
import { makeStyles, Paper, TableCell, Button, Tooltip } from '@material-ui/core';
import {
  Check,
  Close,
  LocalShipping as LocalShippingIcon,
  Remove,
} from '@material-ui/icons';
import { deleteCommand, toValidate, toRefuseAll, CommandLivre, CommandAllLivre } from '../services/commands';
import PageHeader from '../components/Admin/PageHeader';
import Command from '../models/Command.model';
import { useSnackbar } from 'notistack';
import EventEmitter from '../services/EventEmitter';
import useDeleteSelection from '../hooks/useDeleteSelection';
import NumberFormatter from '../utils/NumberFormatter';
import DateFormatter from '../utils/DateFormatter';
import PriceFormatter from '../utils/PriceFormatter';
import moment from 'moment';
import { useAuth } from '../providers/authentication';
import PDFButton from '../components/Common/PDFButton';
import ShowButton from '../components/Common/ShowButton';
import { useHistory } from 'react-router';
import CommandDetailsDialog from '../components/Common/CommandDetailsDialog';
import TableContainer, { HeadCell } from '../components/Table/TableContainer';
import { Loading } from '../components/Common';
import { useDispatch, useSelector } from '../utils/redux';
import { revokeCommand, validateCommand } from '../services/commands';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import SendNotification from '../services/SendNotification';
import { getAllCommands } from '../actions/commandes.action';
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
    id: 'shippingTime',
    label: 'Date de livraison',
  },
  {
    id: 'totalPrice',
    label: 'Montant total',
  },
  {
    id: 'validated',
    label: 'Validation',
  },
  {
    id: 'payed',
    label: 'Payé',
  },
  {
    id: 'hasDelivery',
    label: 'Livré',
  },
  {
    id: 'optionLivraison',
    label: 'Option de livraison',
  },
];

const DeliveryCommandList: React.FC = () => {
  const classes = useStyles();
  const { isRestaurantAdmin, restaurant } = useAuth();

  const dispatch = useDispatch();

  const { data, isLoaded }: any = useSelector(({ commands }: any) => ({
    data: commands.delivery,
    isLoaded: commands.isLoaded
  }));

  const interval = useRef<number>();

  const [records, setRecords] = useState<Command[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCommand, setSelectedCommand] = useState<Command>();
  const [selected, setSelected] = useState<string[]>([]);
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
  );

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

  const toValidateAll = () => {

    setUpdating(true);

    toValidate(selected)
      .then((res: any) => {
        SendNotification({
          title: "Commande validée",
          body: "Votre commande a été validée",
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
          title: "Commande refusée",
          body: "Votre commande a été refusée ",
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

  // useEffect(() => {

  //   interval.current = window.setInterval(fetch, 15000);

  //   getCommandCount('delivery', {
  //     restaurant: isRestaurantAdmin ? restaurant?._id || '' : undefined,
  //     validated: false,
  //   }).then((data) => {

  //     const nbr = sessionStorage.getItem("delivery") || 0;

  //     if (nbr !== data) {

  //       fetch();

  //     }

  //   });

  //   return () => window.clearInterval(interval.current);

  // }, [fetch]);

  const Emporter = (_id: any) => {

    CommandLivre(_id)
      .then((res: any) => {

        enqueueSnackbar('Commande Livrée', {
          variant: 'success',
        });

        if (res.data.commandType === "delivery") {

          SendNotification({
            title: "Commande livrée",
            body: "Votre commande est livrée",
            isRedirectAdmin: false,
            to: new Array(res.data.tokenNavigator)
          })

        }

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

  const livreAll = () => {
    CommandAllLivre(selected)
      .then((res: any) => {

        enqueueSnackbar('Commande emportée', {
          variant: 'success',
        });

        SendNotification({
          title: "Commande livrée",
          body: "Votre commande est livrée",
          isRedirectAdmin: false,
          to: res.data.tokenNavigator
        })

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
        icon={LocalShippingIcon}
        title="Commandes"
        subTitle="Liste des commandes livraison"
      />
      <Paper className={classes.root}>
        <TableContainer
          headCells={headCells}
          records={records}
          toValidateAll={toValidateAll}
          toRefuseAll={toRefuseAllSelected}
          selected={selected}
          onSelectedChange={setSelected}
          livreAll={livreAll}
          showAddButton={false}
          onDeleteClick={() => {
            setUpdating(true);
            handleDeleteSelection().finally(() => {
              EventEmitter.emit('REFRESH_NAVIGATION_BAR');
              setUpdating(false);
            });
          }}
          loading={loading}
          emptyPlaceholder="Aucune commande"
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
              payed: (a, b) =>
                b.payed.status > a.payed.status
                  ? 1
                  : b.payed.status === a.payed.status
                    ? 0
                    : -1,
            },
          }}
        >
          {(command) => {
            const {
              _id,
              code,
              restaurant,
              shippingTime,
              validated,
              revoked,
              payed: { status: payed },
              optionLivraison,
              priceLivraison,
              hasDelivery
            } = command;

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
                  {DateFormatter.format(shippingTime, true)}
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
                <TableCell
                  style={{
                    fontWeight: !validated && !revoked ? 'bold' : undefined,
                  }}
                >
                  {payed ? (
                    <Check htmlColor="green" />
                  ) : (
                    <Close htmlColor="red" />
                  )}
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
                  {optionLivraison === 'behind_the_door'
                    ? 'Derrière la porte'
                    : optionLivraison === 'on_the_door'
                      ? 'Devant la porte'
                      : "À l'extérieur"}
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
                      <Tooltip title="Livré">

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
                          <DirectionsBikeIcon />

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
                                    body: "Votre commande a été validée",
                                    isRedirectAdmin: false,
                                    to: new Array(res.data.tokenNavigator)
                                  })

                                  setRecords(records.map((item: any) => {

                                    if (command._id === item._id) {
                                      return {
                                        ...item,
                                        validated: true
                                      }

                                    }

                                    return item

                                  }))
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
                                    body: "Votre commande a été refusée",
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

export default DeliveryCommandList;
