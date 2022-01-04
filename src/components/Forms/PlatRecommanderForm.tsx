import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
  useTheme,
  TextField
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import useForm, { FormError, FormValidationHandler } from '../../hooks/useForm';
import { getRestaurants } from '../../services/restaurant';
import Restaurant from '../../models/Restaurant.model';
import Food from '../../models/Food.model';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../providers/authentication';
import { getFoods } from '../../services/food'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));

export type PlatRecommanderFormType = {
  _id?: string;
  priority?: number;
  food?: any;
  restaurant?: any;
};
interface PlatRecommandedFormProps {
  initialValues?: PlatRecommanderFormType;
  onSave?: (data: PlatRecommanderFormType) => void;
  onCancel?: () => void;
  saving?: boolean;
  isUpdate?: boolean;
  records: any[];
}

const PlatRecommanderForm: React.FC<PlatRecommandedFormProps> = ({
  initialValues = {
    food: [],
    restaurant: undefined,
  },
  onSave,
  onCancel,
  saving,
  records
}) => {
  const [foods, setFoods] = useState<Food[]>();

  const [loadingRestaurants, setLoadingRestaurants] = useState<boolean>(false);

  const classes = useStyles();

  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { isRestaurantAdmin, restaurant } = useAuth();

  const validation = useCallback<FormValidationHandler<PlatRecommanderFormType>>(
    (data) => {
      const errors: FormError<PlatRecommanderFormType> = {};

      if (!data.food) errors.food = 'Ce champ ne doit pas être vide';

      return errors;
    },
    [],
  );

  const [restoOptions, setRestoOptions] = useState<Restaurant[]>([]);

  const {
    values,
    setValues,
    validate,
  } = useForm<PlatRecommanderFormType>(initialValues, false, validation);

  useEffect(() => {

    setLoadingRestaurants(true);

    getFoods()
      .then((data) => {
        setLoadingRestaurants(false);
        setFoods(data);
      })

    getRestaurants()
      .then(data => setRestoOptions(data || []))
      .catch(e => {
        enqueueSnackbar('Erreur lors du chargement des restos', { variant: 'error' });
      })

  }, [enqueueSnackbar, isRestaurantAdmin, restaurant, setValues]);

  useEffect(() => {

    const object = JSON.parse(sessionStorage.getItem("filterSelected") as any);

    setValues((old) => ({ ...old, restaurant: object.restaurant }));

  }, [setValues, sessionStorage.getItem("filterSelected")]);
  
  
  return (
    <form
      noValidate
      className={classes.root}
      onSubmit={(e) => {
        e.preventDefault();
        (e.currentTarget.querySelector(
          '[type=submit]',
        ) as HTMLInputElement).focus();
        if (validate()) onSave?.(values);
      }}
    >

      <Grid container spacing={2}>
        {!isRestaurantAdmin && (
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Restaurant
            </Typography>
            {/* <Select
              fullWidth
              variant="outlined"
              name="restaurant"
              onChange={handleSelectChange}
              value={values.restaurant}
            // disabled={isUpdate}
            >
              <MenuItem value="" disabled>
                Veuillez sélectionner
              </MenuItem>
              {restoOptions?.map((resto, index) => (
                <MenuItem key={index} value={resto?._id}>{resto?.name}</MenuItem>
              ))}
            </Select> */}

            <Autocomplete
              noOptionsText="Aucun restaurant disponible"
              loading={loadingRestaurants}
              options={restoOptions}
              getOptionLabel={(option) => option.name_resto_code}
              value={restoOptions.find((item: any) => item._id === values.restaurant) || null}
              onChange={(_, v) => {
                if (v) {
                  setValues({ ...values, restaurant: v._id });
                }
                else {
                  setValues({ ...values, restaurant: '' });
                }
              }}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Restaurant"
                />
              )}
            />

            <Typography variant="h5" gutterBottom>
              Plat recommander
            </Typography>

            <Autocomplete
              loadingText="Chargement"
              noOptionsText="Aucun Plat disponible"
              style={{ flexGrow: 2 }}
              loading={loadingRestaurants}
              options={foods?.filter((items: any) => {
                return !values.food.includes(items._id) &&
                  items.restaurant._id === values.restaurant &&
                  !records.map((item: any) => item.food._id).includes(items._id)
              }) || []}
              multiple
              filterSelectedOptions
              value={foods?.filter((items: any) => { return values.food.includes(items._id) }) || []}
              getOptionLabel={(option) => option.name}
              onChange={(_, v: any) => {
                if (v) {

                  setValues((old) => ({
                    ...old, food: v.map((items: any) => items._id)
                  })

                  );
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Plat"
                />
              )}
            />

          </Grid>)}
        <Grid item container justify="flex-end" alignItems="center" xs={12}>
          <Button
            variant="contained"
            color="default"
            disabled={saving}
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Box width={theme.spacing(2)} />
          <Button variant="contained" color="primary" type="submit">
            {!saving ? (
              'Enregistrer'
            ) : (
              <CircularProgress color="inherit" size="25.45px" />
            )}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default PlatRecommanderForm;

