import React, { useCallback, useEffect, useState } from 'react';
import {
  makeStyles,
  Paper,
  TableCell,
  Button,
  Tooltip
} from '@material-ui/core';
import {
  Check,
  Close,
  LocationOn as LocationOnIcon,
  Remove,
} from '@material-ui/icons';
import PageHeader from '../components/Admin/PageHeader';
import Command from '../models/Command.model';
import { useSnackbar } from 'notistack';
import EventEmitter from '../services/EventEmitter';
import useDeleteSelection from '../hooks/useDeleteSelection';
import NumberFormatter from '../utils/NumberFormatter';
import DateFormatter from '../utils/DateFormatter';
import moment from 'moment';
import { useAuth } from '../providers/authentication';
import PDFButton from '../components/Common/PDFButton';
import { useHistory } from 'react-router';
import CommandDetailsDialog from '../components/Common/CommandDetailsDialog';
import ShowButton from '../components/Common/ShowButton';
import TableContainer, { HeadCell } from '../components/Table/TableContainer';
import { Loading } from '../components/Common';
import { useDispatch } from 'react-redux';
import { useSelector } from '../utils/redux';
import { getAllCommands } from '../actions/commandes.action';
import { revokeCommand, validateCommand, deleteCommand, toValidate, toRefuseAll } from '../services/commands';
import CheckIcon from '@material-ui/icons/Check';
import SendNotification from '../services/SendNotification';
import ClearIcon from '@material-ui/icons/Clear';


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
    id: 'validated',
    label: 'Validation',
  },
];

const OnSiteCommandList: React.FC = () => {

  const classes = useStyles();
  const { isRestaurantAdmin, restaurant } = useAuth();

  const dispatch = useDispatch();

  const { data, isLoaded }: any = useSelector(({ commands }: any) => ({
    data: commands.onSite,
    isLoaded: commands.isLoaded
  }));

  const [records, setRecords] = useState<Command[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [command, setCommand] = useState<Command>();
  const [selected, setSelected] = useState<string[]>([]);
  const [updating, setUpdating] = useState<boolean>(false);

  const setSelectedCommand = (data: any) => {

    setCommand(data);

    if (!data) {
      return
    }

    if (!data.validated) {

      validateCommand(data._id)
        .then((res: any) => {

          SendNotification({

            title: "Commande commande",
            body: "Votre Commande a été validé ",
            isRedirectAdmin: false,
            to: new Array(res.tokenNavigator)
          })

          EventEmitter.emit('REFRESH_NAVIGATION_BAR');

          setRecords((records) => {
            data.validated = true;
            return [...records];
          });

        });

    }

  }

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
    } catch (e) {
      enqueueSnackbar('Erreur lors du chargement...', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
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

  //   getCommandCount('on_site', {
  //     restaurant: isRestaurantAdmin ? restaurant?._id || '' : undefined,
  //     validated: false,
  //   }).then((data) => {

  //     const nbr = sessionStorage.getItem("on_site") || 0;

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
          title: "Commande validée",
          body: "Votre Commande a été validée ",
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

  return (
    <>
      <PageHeader
        icon={LocationOnIcon}
        title="Commandes"
        subTitle="Liste des commandes sur place"
      />
      <Paper className={classes.root}>
        <TableContainer
          headCells={headCells}
          records={records}
          selected={selected}
          toRefuseAll={toRefuseAllSelected}
          toValidateAll={toValidateAll}
          onSelectedChange={setSelected}
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
            const { _id, code, restaurant, createdAt, validated, revoked } =
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
                  {restaurant?.name}
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
                      if (!validated) {
                        validateCommand(_id).then(() => {
                          EventEmitter.emit('REFRESH_NAVIGATION_BAR');
                          setRecords((records) => {
                            command.validated = true;
                            return [...records];
                          });
                        });
                      }
                      setSelectedCommand(command);
                    }}
                  />

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
                                    body: "Votre Commande a été validée ",
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

                                    return item;

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
        open={!!command}
        command={command}
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

export default OnSiteCommandList;
