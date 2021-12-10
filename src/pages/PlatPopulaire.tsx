import React, { useCallback, useEffect, useRef, useState } from 'react';
import { makeStyles, Paper, TableCell } from '@material-ui/core';
import PageHeader from '../components/Admin/PageHeader';
import { List as ListIcon } from '@material-ui/icons';
import PlatRecommander from '../models/PlatRecommander.model';
import {
  getPlatPopulaire,
  addPlatPopulaire,
  updatePlatPopulaire,
  deletePlatPopulaire
} from '../services/platPopulaire';
import { useSnackbar } from 'notistack';
import EventEmitter from '../services/EventEmitter';
import useDeleteSelection from '../hooks/useDeleteSelection';
import FormDialog from '../components/Common/FormDialog';
import PlatRecommanderForm, {
  PlatRecommanderFormType,
} from '../components/Forms/PlatRecommanderForm';
import EditButton from '../components/Common/EditButton';
import DeleteButton from '../components/Common/DeleteButton';
import useDelete from '../hooks/useDelete';
import TableContainer, { HeadCell } from '../components/Table/TableContainer';
import { Loading } from '../components/Common';
import { useAuth } from '../providers/authentication';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));

const headCells: HeadCell<PlatRecommander>[] = [
  {
    id: 'food',
    label: 'Nom',
    disableSorting: true,
  },
  {
    id: 'food',
    label: 'Restaurant',
    disableSorting: true,
  },
];

const PlatRecommanderListPage: React.FC = () => {
  const classes = useStyles();

  const { isAdmin, isRestaurantAdmin, restaurant } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<PlatRecommander[]>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [updating, setUpdating] = useState<boolean>(false);
  const [activeOndragDrop, setActiveOndragDrop] = useState<boolean>(false);
  const modif = useRef<PlatRecommanderFormType>();

  const { enqueueSnackbar } = useSnackbar();
  const { handleDeleteSelection } = useDeleteSelection(
    deletePlatPopulaire,
    selected,
    {
      onDeleteRecord: (id) =>
        setRecords((v) => v.filter(({ _id }) => _id !== id)),
    },
  );
  const { handleDelete } = useDelete(deletePlatPopulaire);

  const fetch = useCallback(() => {
    setLoading(true);
    setRecords([]);
    const filter = (isRestaurantAdmin && restaurant) ? { restaurant: restaurant._id } : undefined
    getPlatPopulaire(filter)
      .then((data) => {
        setRecords(data.map((item: any) => {
          return {
            ...item,
            restaurant: item.food.restaurant
          }
        }));
      })
      .catch(() => {
        enqueueSnackbar('Erreur lors du chargement...', { variant: 'error' });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [enqueueSnackbar, isRestaurantAdmin, restaurant]);

  const saveData = useCallback(
    (data: PlatRecommanderFormType) => {
      setSaving(true);
      if (modif.current && data._id)
        updatePlatPopulaire(data._id, data)
          .then(async () => {
            enqueueSnackbar('plat modifié avec succès', {
              variant: 'success',
            });
            setOpenForm(false);
            EventEmitter.emit('REFRESH');
          })
          .catch(() => {
            enqueueSnackbar('Erreur lors de la modification', {
              variant: 'error',
            });
          })
          .finally(() => {
            modif.current = undefined;
            setSaving(false);
          });
      else
        addPlatPopulaire(data)
          .then(async (res) => {
            enqueueSnackbar('Type ajouté avec succès', {
              variant: 'success',
            });
            setOpenForm(false);
            EventEmitter.emit('REFRESH');
          })
          .catch(() => {
            enqueueSnackbar("Erreur lors de l'ajout", {
              variant: 'error',
            });
          })
          .finally(() => {
            modif.current = undefined;
            setSaving(false);
          });
    },
    [enqueueSnackbar],
  );

  const showModification = useCallback((recommandedFood: PlatRecommander) => {
    return;
    // const {
    //   _id,
    //   priority,
    //   food
    // } = recommandedFood;

    // modif.current = {
    //   _id,
    //   priority,
    //   food: food
    // };
    // setOpenForm(true);
  }, []);

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
    fetch();
  }, [fetch]);

  const setArraySelected = (data: any) => {
    if (data.restaurant !== "") {
      setActiveOndragDrop(true);
    }
  }


  return (
    <>
      <PageHeader title="Plats populaire" subTitle="Liste des plats populaire" icon={ListIcon} />
      <Paper className={classes.root}>
        <TableContainer
          headCells={headCells}
          records={records}
          selected={selected}
          onSelectedChange={setSelected}
          setArraySelected={setArraySelected}
          onDeleteClick={() => {
            setUpdating(true);
            handleDeleteSelection().finally(() => setUpdating(false));
          }}
          addButtonLabel="Recommander un plat"
          onAddClick={() => setOpenForm(true)}
          loading={loading}
          emptyPlaceholder="Aucune recommandation"
          options={{
            selectableRows: isAdmin,
            orderBy: 'priority',
            order: 'asc',
            enableDragAndDrop: true,
            hasActionsColumn: true,
            filters: [
              {
                id: 'restaurant',
                label: 'Restaurant',
                type: 'RESTAURANT',
              }],
            onDragEnd: (source, destination) =>
              setRecords((records) => {
                const p1 = source.priority,
                  p2 = destination.priority;

                if (p1 > p2) {
                  // Queueing up
                  records
                    .filter(({ priority }) => priority >= p2 && priority < p1)
                    .forEach((v) => {
                      v.priority++;
                      updatePlatPopulaire(v._id, { priority: v.priority });
                    });
                } else {
                  // Queueing down
                  records
                    .filter(({ priority }) => priority > p1 && priority <= p2)
                    .forEach((v) => {
                      v.priority--;
                      updatePlatPopulaire(v._id, { priority: v.priority });
                    });
                }
                source.priority = p2;
                updatePlatPopulaire(source._id, { priority: p2 });

                return [...records];
              }),
            selectOnClick: false,
            onRowClick: (_, recommandedFood) => showModification(recommandedFood),
          }}
        >
          {(recommandedFood) => {
            const {
              _id,
              food,
              restaurant
            } = recommandedFood as any;
            return (
              <React.Fragment key={_id}>
                <TableCell>{food?.name.fr}</TableCell>
                <TableCell>{restaurant?.name_resto_code}</TableCell>
                <TableCell>
                  {/* <EditButton
                    onClick={(e) => {
                      e.stopPropagation();
                      showModification(recommandedFood);
                    }}
                  /> */}
                  <DeleteButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setUpdating(true);
                      handleDelete(_id)
                        .then(() =>
                          setRecords((v) =>
                            v.filter(({ _id: id }) => _id !== id),
                          ),
                        )
                        .finally(() => setUpdating(false));
                    }}
                  />
                </TableCell>
              </React.Fragment>
            );
          }}
        </TableContainer>
      </Paper>
      <FormDialog
        title={modif.current ? 'Modifier un plat' : 'Ajouter un plat'}
        onClose={() => {
          setOpenForm(false);
          modif.current = undefined;
        }}
        open={openForm}
      >
        <PlatRecommanderForm
          initialValues={modif.current}
          isUpdate={modif.current ? true : false}
          saving={saving}
          onSave={saveData}
          onCancel={() => setOpenForm(false)}
          records={records}
        // isUpdate={modif.current ? true : false}
        />
      </FormDialog>

      <Loading
        open={updating}
        semiTransparent
        backgroundColor="rgba(0, 0, 0, .7)"
      />
    </>
  );
};

export default PlatRecommanderListPage;
