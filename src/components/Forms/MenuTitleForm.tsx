import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    makeStyles,
    TextField,
    Typography,
    useTheme,
} from '@material-ui/core';
import useForm, { FormError, FormValidationHandler } from '../../hooks/useForm';
import Restaurant from '../../models/Restaurant.model';
import { getRestaurants } from '../../services/restaurant';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../providers/authentication';
import { Autocomplete } from '@material-ui/lab';


const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}));

export type MenuTitleFormType = {
    _id?: string;
    priority?: number;
    name: string;
    restaurant: string;
};

interface MenuTitleFormProps {
    initialValues?: MenuTitleFormType;
    onSave?: (data: MenuTitleFormType) => void;
    onCancel?: () => void;
    saving?: boolean;
    isUpdate?: boolean;
}

const MenuTitleForm: React.FC<MenuTitleFormProps> = ({
    initialValues = {
        name: '',
        restaurant: '',
    },
    onSave,
    onCancel,
    saving,
}) => {
    const classes = useStyles();

    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const { isRestaurantAdmin, restaurant } = useAuth();

    const validation = useCallback<FormValidationHandler<MenuTitleFormType>>((data) => {

            const errors: FormError<MenuTitleFormType> = {};

            if (!data.name.length) errors.name = 'Ce champ ne doit pas être vide';
            if (!data.restaurant.length) errors.restaurant = 'Ce champ ne doit pas être vide';

            return errors;

        },[]);

    const [loadingRestaurants, setLoadingRestaurants] = useState<boolean>(false);
    const [restaurantOptions, setRestaurantOptions] = useState<Restaurant[]>([]);

    const {
        values,
        handleInputBlur,
        setValues,
        errors,
        validate,
    } = useForm<MenuTitleFormType>(initialValues, false, validation);

 
    useEffect(() => {
     
        setLoadingRestaurants(true);
        getRestaurants()
            .then((data) => setRestaurantOptions(data))
            .finally(() => setLoadingRestaurants(false));

    }, [enqueueSnackbar, isRestaurantAdmin, restaurant, setValues])

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
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Nom
                    </Typography>
                    <TextField
                        type="name"
                        name="name"
                        placeholder="Nom du titre"
                        variant="outlined"
                        fullWidth
                        defaultValue={initialValues.name}
                        error={!!errors.name}
                        helperText={errors.name}
                        onBlur={handleInputBlur}
                    />
                </Grid>
                {!isRestaurantAdmin && (<Grid item xs={12}>
                    <Typography variant="h5" gutterBottom>
                        Restaurant
                    </Typography>
                    <Autocomplete
                        noOptionsText="Aucun restaurant disponible"
                        loading={loadingRestaurants}
                        options={restaurantOptions}
                        getOptionLabel={(option) => option.name}
                        value={
                            restaurantOptions.find(
                                ({ _id }) => _id === values.restaurant,
                            ) || null
                        }
                        onChange={(_, v) => {
                            if (v) {
                                setValues((old) => ({ ...old, restaurant: v._id }));
                            
                            }
                            else {
                                setValues((old) => ({ ...old, restaurant: '' }));
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

export default MenuTitleForm;
