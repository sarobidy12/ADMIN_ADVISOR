import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core';
import useForm, { FormError, FormValidationHandler } from '../../hooks/useForm';
import Restaurant from '../../models/Restaurant.model';
import { getRestaurants } from '../../services/restaurant';
import { Autocomplete } from '@material-ui/lab';
import { getFoods, addFoodMenu } from '../../services/food';
import Food from '../../models/Food.model';
import { useAuth } from '../../providers/authentication';
import InputMenu from '../../components/DND/ListMenu';
import {
  AddCircle as AddCircleIcon,
} from '@material-ui/icons';
import FormDialog from '../Common/FormDialog';
import AddEditMenu from '../../components/Forms/AddEditMenu';
import FoodForm from '../../components/Forms/FoodForm';
import { useSnackbar } from 'notistack';

export type MenuFormType = {
  _id?: string;
  priority?: number;
  name: string;
  description: string;
  type: string;
  restaurant: string;
  foods: string[];
  options: { title: string; maxOptions: string; items: any[], isObligatory?: boolean }[];
  price: string;
  prices: any;
};

interface MenuFormProps {
  initialValues?: MenuFormType;
  saving?: boolean;
  onSave?: (data: MenuFormType) => void;
  onCancel?: () => void;
}

const MenuForm: React.FC<MenuFormProps> = ({
  initialValues = {
    name: '',
    description: '',
    type: '',
    restaurant: '',
    foods: [],
    options: [],
    price: '0',
    prices: {},
  },
  saving,
  onSave,
  onCancel,
}) => {
  const { restaurant, isRestaurantAdmin } = useAuth();

  const [restaurantOptions, setRestaurantOptions] = useState<Restaurant[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState<boolean>(false);

  const [foodOptions, setFoodOptions] = useState<Food[]>([]);
  const [initValue, setInitValue] = useState<any>({});
  const [index, setIndex] = useState<number>(0);
  const [openAccompagnement, setOpenAccompagnement] = useState<boolean>(false);
  const [loadFood, setLoadFood] = useState(false);


  const validation: FormValidationHandler<MenuFormType> = (data) => {
    const errors: FormError<MenuFormType> = {};

    if (!data.name.length) errors.name = 'Ce champ ne doit pas être vide';
    if (!data.type.length) errors.type = 'Ce champ ne doit pas être vide';
    if (!data.restaurant.length)
      errors.restaurant = 'Ce champ ne doit pas être vide';
    if (!data.options.length)
      errors.foods = 'Vous devez sélectionner au moins un plat';
    if (!data.description.length)
      errors.description = 'Ce champ ne doit pas être vide';

    return errors;
  };

  const {
    values,
    setValues,
    validate,
    handleInputBlur,
    handleSelectChange,
    errors,
    setOption,
  } = useForm(
    {
      ...initialValues,
      restaurant: restaurant ? restaurant._id : initialValues.restaurant,
    },
    false,
    validation,
  );

  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const [selectedResto, setSelectedResto] = useState<Restaurant | null>(null);
  const [disableAll, setDisableAll] = useState(true);
  const [food, setFood] = useState<any>({});
  const [openFood, setOpenFood] = useState<boolean>(false);

  const handleSelectResto = useCallback(
    (resto: Restaurant) => {
      if (resto) {
        setSelectedResto(resto);
        setDisableAll(false);
      }
    }, []
  )

  useEffect(() => {

    if (values.restaurant) {
      setDisableAll(false);
    }

    setLoadingRestaurants(true);
    getRestaurants()
      .then((data) => setRestaurantOptions(data))
      .finally(() => setLoadingRestaurants(false));

  }, [values, setDisableAll, setRestaurantOptions, setLoadingRestaurants]);

  const filterArray = useCallback((a: any[], b: any[]) => {

    const arrayHasFilter: any[] = [];
    const idExist: any[] = [];

    for (let i = 0; i < b.length; i++) {

      if (b[i].length > 0) {

        for (let t = 0; t < b[i].length; t++) {

          if (!idExist.includes(b[i][t]._id)) {
            arrayHasFilter.push(b[i][t]);
          }

        }

      }

    }

    const mapTest = a.map((items: any) => {

      if (arrayHasFilter.filter((item: any) => item._id === items._id).length > 0) {
        return arrayHasFilter.find((item: any) => item._id === items._id);
      }

      return items;

    });

    setFoodOptions(mapTest);
  }, [setFoodOptions])

  useEffect(() => {

    let filter = values.restaurant;
    if (isRestaurantAdmin && restaurant) {
      filter = restaurant._id
    } else if (!isRestaurantAdmin && selectedResto) {
      filter = selectedResto?._id
    }

    getFoods({
      lang: 'fr',
      restaurant: filter
    })
      .then((data) => {
        filterArray(data as any[], values.options.map((item: any) => item.items) as any[]);
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [values, selectedResto, filterArray, isRestaurantAdmin, restaurant]);

  const listPrice = (a: any[], b: any[]) => {

    const array = [];

    if (b.length > 0) {

      for (let i = 0; i < b.length; i++) {
        array.push(a.filter((items: any) => items._id === b[i])[0])
      }

      const priority = array;

      if (priority.filter((item: any) => item).length) {
        return priority;
      }

    }

    return [];

  }

  const setAddEdit = (value: any, index: number) => {

    setInitValue(value);
    setIndex(index);
    setOpenAccompagnement(true)
  }

  const addNewAccompaniment = useCallback(() => {

    const { options } = values;

    options.push({
      title: '',
      maxOptions: '0',
      items: [],
      isObligatory: false
    });

    setValues((v) => ({ ...v, options }));
  }, [setValues, values]);

  const saveData = async (data: any) => {
    setLoadFood(true);
    try {

      const id = data._id;

      const response: any = await addFoodMenu(data);

      if (response) {

        const foodMap = foodOptions.map((item: any) => {

          if (item._id === id) {

            return {
              ...response.data,
              name: response.data.name.fr,
              _id: id
            };

          }

          return item;

        });

        foodMap.length > 0 && setFoodOptions(foodMap);

        enqueueSnackbar('Plat modifié avec succès', {
          variant: 'success',
        });

      }


    } catch (err: any) {

      enqueueSnackbar('Erreur lors de la modification', {
        variant: 'error',
      });

    } finally {
      setFood({});
      setOpenFood(false)
      //  setOpenAccompagnement(true)
      setLoadFood(false);

    }

  }

  const UpdateFood = (data: any) => {

    setFood({
      ...data,
      restaurant: data.restaurant._id,
      attributes: data.attributes.map((item: any) => item._id),
      allergene: data.allergene.map((item: any) => item._id),
      options: data.options.map((item: any) => {
        return {
          title: item.title,
          maxOptions: String(item.maxOptions),
          items: item.items.map((v: any) => v),
          isObligatory: item.isObligatory
        }
      }),
      type: data.type._id,
      price: String((data.price.amount || 0) / 100),
    });

    setOpenFood(true)
    //    setOpenAccompagnement(false)

  }

  return (
    <>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          (e.currentTarget.querySelector(
            '[type=submit]',
          ) as HTMLInputElement).focus();


          if (validate()) onSave?.(values);
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Nom
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Nom"
              name="name"
              defaultValue={initialValues.name}
              onBlur={handleInputBlur}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Type
            </Typography>
            <FormControl fullWidth variant="outlined" error={!!errors.type}>
              <Select
                defaultValue={initialValues.type}
                name="type"
                onChange={handleSelectChange}
              >
                <MenuItem value="" disabled>
                  Sélectionner un type
                </MenuItem>
                <MenuItem value="per_food">Prix par plats</MenuItem>
                {/* <MenuItem value="priceless">Sans prix</MenuItem> */}
                <MenuItem value="fixed_price">Prix fixe</MenuItem>
              </Select>
              <FormHelperText>{errors.type}</FormHelperText>
            </FormControl>
          </Grid>
          {values.type === 'fixed_price' && (
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Prix
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="price"
                name="price"
                defaultValue={initialValues.price}
                onBlur={handleInputBlur}
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">€</InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}
          {!isRestaurantAdmin && (
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Restaurant
              </Typography>
              <Autocomplete
                loadingText="Chargement"
                noOptionsText="Aucun restaurant disponible"
                loading={loadingRestaurants}
                options={restaurantOptions}
                getOptionLabel={(option) => option.name_resto_code}
                value={
                  restaurantOptions.find(
                    ({ _id }) => values.restaurant === _id,
                  ) || null
                }
                onChange={(_, v) => {
                  if (v) {
                    setValues((old) => ({ ...old, restaurant: v._id }));
                    handleSelectResto(v)
                  }
                  else {
                    setValues((old) => ({ ...old, restaurant: '' }));
                    setSelectedResto(null)
                    setDisableAll(true)
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Restaurant"
                    error={!!errors.restaurant}
                    helperText={errors.restaurant}
                  />
                )}
              />
            </Grid>
          )}
          <Grid item xs={12}>

            {/* <Autocomplete
            loadingText="Chargement"
            noOptionsText="Aucun plat disponible"
            loading={loadingFoods}
            options={foodOptions}
            multiple
            filterSelectedOptions
            disabled={!selectedResto && disableAll}
            getOptionLabel={(option) => option.name}
            value={foodOptions.filter(({ _id }) =>
              values.foods.find((d) => _id === d),
            )}
            onChange={(_, v) => {
              setFoods(v);
              setValues((old) => {

                if (v.length > old.prices.length) old.prices.push('0');
                else if (v.length < old.prices.length) old.prices.pop();

                return { ...old, foods: v.map(({ _id }) => _id) };
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Plats"
                error={!!errors.foods}
                helperText={errors.foods}
              />
            )}
          />  */}

            {/* <InputMenu
            listMenu={foodOptions}
            disabled={!selectedResto && disableAll}
            setMenu={setAccompagnement}
            value={priority(foodOptions, values.foods).filter((item: any) =>
              values.foods.find((d) => item._id === d),
            )}
          /> */}
            <Grid
              container
              justify="flex-end"
              alignItems="center"
              style={{
                position: 'relative',
                margin: '1vh 0'
              }}
            >
              <Button
                variant="contained"
                startIcon={<AddCircleIcon />}
                color="secondary"
                onClick={addNewAccompaniment}
              >
                Ajouter des plats
              </Button>
            </Grid>

            <Grid item xs={12}>
              <InputMenu
                updateList={(value: any) => {
                  setOption(value);
                }}
                list={values.options.map((items: any, i: number) => {
                  let id = i + 1;
                  return { ...items, id: items.id ? items.id : id };
                })}
                setAddEdit={setAddEdit}
                setValues={setValues}
                values={values}
                accompanimentOptions={foodOptions}
                selectedResto={selectedResto}
                disableAll={disableAll}
              />
            </Grid>

          </Grid>

          {(values.type === 'fixed_price' && listPrice(foodOptions, values.foods).length > 0) && (

            <Grid item xs={12}>
              <Typography
                variant="h5"
                gutterBottom
                style={{ textDecoration: 'underline', fontWeight: 'bold' }}
              >
                Prix additionnels
              </Typography>
              <Container
                maxWidth="sm"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  columnGap: theme.spacing(2),
                  padding: theme.spacing(2, 0),
                }}
              >
                {listPrice(foodOptions, values.foods).map((food, i) => (
                  <React.Fragment key={i}>
                    <Typography
                      variant="h5"
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'grey',
                          marginRight: theme.spacing(1),
                        }}
                      ></span>
                      {food.name}
                    </Typography>
                    <TextField
                      type="number"
                      fullWidth
                      variant="outlined"
                      placeholder="Prix"
                      name={food._id}
                      defaultValue={values.prices[food._id]}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">€</InputAdornment>
                        ),
                      }}
                      onChange={({ target: { value, name } }) => {
                        setValues((old) => {
                          return {
                            ...old,
                            prices: {
                              ...old.prices,
                              [name]: value
                            }
                          }
                        })
                      }}
                    />
                  </React.Fragment>
                ))}
              </Container>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Description
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Description"
              name="description"
              multiline
              rows={6}
              defaultValue={initialValues.description}
              onBlur={handleInputBlur}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>
          <Grid item container justify="flex-end" alignItems="center" xs={12}>
            <Button
              variant="contained"
              color="default"
              disabled={saving}
              size="large"
              onClick={onCancel}
            >
              Annuler
            </Button>
            <Box width={theme.spacing(2)} />
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
            >
              {!saving ? (
                'Enregistrer'
              ) : (
                <CircularProgress color="inherit" size="25.45px" />
              )}
            </Button>
          </Grid>
        </Grid>
      </form>

      <FormDialog
        title={`Ajouter un plat`}
        open={openAccompagnement}
        fullScreen={false}
        onClose={() => {
          setOpenAccompagnement(false)
        }}
      >
        <AddEditMenu
          isPriceFix={values.type === 'fixed_price' || false}
          initialValues={initValue}
          listMenu={foodOptions}
          updateList={(value: any) => {
            setOption(value);
          }}
          list={values.options}
          onCancel={() => setOpenAccompagnement(false)}
          index={index}
          updatePlat={UpdateFood}
        />
      </FormDialog>

      <FormDialog
        title='Modifier un plat'
        open={openFood}
        onClose={() => {
          setFood({});
          setOpenFood(false)
          //   setOpenAccompagnement(true)
        }}
      >
        <FoodForm
          modification={true}
          initialValues={food}
          saving={loadFood}
          onSave={saveData}
          onCancel={() => {
            setFood({});
            setOpenFood(false)
            //      setOpenAccompagnement(true)
          }}
        />
      </FormDialog>
    </>
  );
};

export default MenuForm;
