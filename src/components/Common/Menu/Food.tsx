import React from 'react';
import {
    Avatar,
    Grid,
    Typography,
    useTheme,
} from '@material-ui/core';
import useStyles from './style';
import clsx from 'clsx';
import FastfoodIcon from '@material-ui/icons/Fastfood';

interface IProps {
    food: any[];
}

const Foods: React.FC<{ food: any[] }> = (props: any) => {

    const classes = useStyles();

    const theme = useTheme();

    const {
        food,
    } = props as IProps;

    return (
        <>
            {food.length > 0 && (

                <div className={classes.itemContainer}>

                    {(food as any[]).map((food: any, index: any) => {

                        return (
                            <div
                                key={food.id}

                            >

                                <Grid container spacing={1} alignItems="center">

                                    <Grid item>
                                        {
                                            food?.imageURL ? (
                                                <Avatar src={food?.imageURL} alt={food?.name} />
                                            ) : (
                                                <FastfoodIcon />
                                            )
                                        }
                                    </Grid>

                                    <Grid item xs>

                                        <Typography
                                            variant="h6"
                                            className={clsx(classes.itemName, 'translate')}
                                            align="left"
                                        >
                                            {food?.name}

                                        </Typography>

                                    </Grid>

                                    <Grid item>

                                        <Typography
                                            align="left"
                                            className={clsx(classes.itemPrice)}
                                        >
                                            {+food?.price.amount > 0 && `€${(food?.price.amount / 100).toLocaleString(undefined, {
                                                minimumFractionDigits: 1,
                                            })}`}
                                        </Typography>

                                    </Grid>
                                </Grid>

                                {!!food.options.length && (
                                    <>
                                        <Grid
                                            item
                                            container
                                            style={{
                                                marginTop: theme.spacing(1),
                                                paddingLeft: theme.spacing(8),
                                            }}
                                            direction="column"
                                        >
                                            {food.options.map(
                                                (options: any) =>
                                                    !!options.items.length && (
                                                        <Grid item container>
                                                            <Typography
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    textDecoration: 'underline',
                                                                }}
                                                            >
                                                                {options?.title}
                                                            </Typography>
                                                            <Grid
                                                                container
                                                                alignItems="center"
                                                                justify="space-between"
                                                            >
                                                                <Grid
                                                                    item
                                                                    xs
                                                                    direction="column"
                                                                >

                                                                    {options?.items.map((optionItems: any) => (
                                                                        <Grid
                                                                            item
                                                                            xs
                                                                            container
                                                                            style={{
                                                                                paddingLeft: theme.spacing(4),
                                                                            }}
                                                                        >
                                                                            <Grid
                                                                                item
                                                                                style={{
                                                                                    fontWeight: 'bold',
                                                                                    textDecoration: 'none',
                                                                                }}
                                                                            >
                                                                                <span>
                                                                                    {optionItems?.quantity} X
                                                                                </span>
                                                                            </Grid>
                                                                            <Grid
                                                                                item
                                                                                style={{
                                                                                    marginLeft: theme.spacing(2),
                                                                                }}
                                                                            >
                                                                                <Typography
                                                                                    className={clsx(classes.itemPrice)}
                                                                                    align="left"
                                                                                >
                                                                                    {optionItems?.name}

                                                                                    <br />
                                                                                    {+optionItems?.price?.amount > 0 && `€${(optionItems?.price?.amount / 100).toLocaleString(undefined, {
                                                                                        minimumFractionDigits: 1,
                                                                                    })}`}

                                                                                </Typography>
                                                                            </Grid>
                                                                        </Grid>
                                                                    ))}
                                                                </Grid>

                                                                {options?.items
                                                                    .map((item: any) => (item.price.amount || 0) * (item.quantity))
                                                                    .reduce((a: any, b: any) => a + b) > 0 &&
                                                                    (
                                                                        <Typography
                                                                            className={classes.itemPrice}
                                                                        >
                                                                            {`€${(options?.items
                                                                                .map((item: any) => (item.price.amount || 0) * (item.quantity))
                                                                                .reduce((a: any, b: any) => a + b) / 100).toLocaleString(undefined, {
                                                                                    minimumFractionDigits: 1,
                                                                                })}`}
                                                                        </Typography>
                                                                    )}

                                                            </Grid>
                                                        </Grid>
                                                    )
                                            )}
                                        </Grid>
                                    </>
                                )}

                            </div>
                        );


                    })}
                </div>
            )
            }

        </>
    );
};


export default Foods
