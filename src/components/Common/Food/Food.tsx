import React from 'react';
import {
    Avatar,
    Box,
    Button,
    Grid,
    IconButton,
    Typography,
    useTheme,
    Fab,
} from '@material-ui/core';
import {
    Delete as DeleteIcon,
    Add as AddIcon,
    Close as CloseIcon,
    Remove as RemoveIcon,
} from '@material-ui/icons';
import useStyles from './style';
import clsx from 'clsx';
import { useHistory } from 'react-router';
import Accompagnement from './accompagnement';

export const estimateFoodPrice = (item: any, quantity: any) => {

    return ((item.option.length > 0) ?
        (item.option.map((item: any) => +item.amount).reduce((a: any, b: any) => a + b) + item.price) * quantity : item.price * quantity)

}

export const estimateFoodPriceOnly = (item: any) => {

    return ((item.option.length > 0) ? item.option.map((item: any) => +item.amount)
        .reduce((a: any, b: any) => a + b) : 0) + item.price

}

interface IProps {
    food: any[];
}

const Foods: React.FC<{ food: any[] }> = (props: any) => {

    const classes = useStyles();

    const history = useHistory();

    const {
        food,
    } = props as IProps;

    return (
        <>
            {food.length > 0 && (
                <div className={classes.itemContainer}>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item>
                            <Typography variant="h6" gutterBottom className="translate">
                                Les plats
                            </Typography>
                        </Grid>
                        <Grid item>

                        </Grid>
                    </Grid>

                    {food.map((food: any) => {

                        const {
                            id,
                            imageURL,
                            name,
                            option,
                            quantity,
                        } = food;

                        return (

                            <Button fullWidth key={id} style={{ display: 'block' }}>

                                <Grid container spacing={1} alignItems="center">

                                    <Grid item>
                                        <Box
                                            width={50}
                                            textAlign="center"
                                            alignSelf="center"
                                        >
                                            {quantity} X
                                        </Box>
                                    </Grid>

                                    <Grid item xs>

                                        <Grid container spacing={1} alignItems="center">

                                            <Grid item>
                                                <Avatar src={imageURL} alt={name} />
                                            </Grid>

                                            <Grid item>

                                                <Typography
                                                    variant="h6"
                                                    className={clsx(classes.itemName, 'translate')}
                                                    align="left"
                                                >
                                                    {name}
                                                </Typography>

                                                <Typography
                                                    align="left"
                                                    className={clsx(classes.itemPrice)}
                                                >
                                                    <span>Prix : </span>
                                                    {console.log("---->", food)}
                                                    <span>
                                                        {`€${(estimateFoodPriceOnly(food) / 100).toLocaleString(undefined, {
                                                            minimumFractionDigits: 1,
                                                        })}`}
                                                    </span>
                                                </Typography>

                                                {+estimateFoodPrice(food, quantity) > 0 && (<Typography
                                                    align="left"
                                                    className={clsx(classes.itemPrice)}
                                                >
                                                    <span>Total: </span>
                                                    <span>
                                                        {`€${(estimateFoodPrice(food, quantity) / 100).toLocaleString(undefined, {
                                                            minimumFractionDigits: 1,
                                                        })}`}
                                                    </span>
                                                </Typography>)
                                                }

                                            </Grid>

                                        </Grid>

                                    </Grid>

                                </Grid>

                                <Accompagnement
                                    option={option}
                                />

                            </Button>
                        )

                    })}
                </div>
            )
            }

        </>
    );
};

export default Foods;
