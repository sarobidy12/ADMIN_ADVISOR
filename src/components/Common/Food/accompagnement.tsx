import React from 'react';
import {
    Avatar,
    Box,
    Button,
    Grid,
    IconButton,
    Divider,
    Typography,
    useTheme,
    Theme
} from '@material-ui/core';
import {
    Delete as DeleteIcon,
} from '@material-ui/icons';
import useStyles from './style';
import clsx from 'clsx';
 

interface IAccompagnement {
    option: any[];
}

const Accompagnement: React.FC<IAccompagnement> = (props: any) => {

    const { option } = props as IAccompagnement;

    const classes = useStyles();

    const theme = useTheme();

    const filterAccompagnement = (data: any) => {
        const arrayArray: any[] = [];

        const ArrayFilter = [];

        for (let i = 0; i < data.length; i++) {

            if (!arrayArray.includes(data[i].name)) {

                arrayArray.push(data[i].name);

            }

        }

        for (let i = 0; i < arrayArray.length; i++) {
            ArrayFilter.push(data.find((item: any) => item.name === arrayArray[i]))
        }

        return ArrayFilter;

    }

    const filter = (data: any) => {

        const arrayArray: any[] = [];
        const ArrayFilter = [];

        for (let i = 0; i < data.length; i++) {

            if (!arrayArray.includes(data[i].option)) {

                arrayArray.push(data[i].option);

            }

        }

        for (let i = 0; i < arrayArray.length; i++) {
            ArrayFilter.push({
                title: arrayArray[i],
                quantity: option.filter((item: any) => item.option === arrayArray[i]).length,
                items: filterAccompagnement(option.filter((item: any) => item.option === arrayArray[i]))
            })

        }

        return ArrayFilter;

    }

    return (
        <>
            {filter(option).length > 0 && (
                <>
                    <Divider className={classes.divider} />

                    <Grid
                        item
                        container
                        style={{
                            marginTop: theme.spacing(1),
                            paddingLeft: theme.spacing(14),
                        }}
                        direction="column"
                    >
                        {filter(option).map((items: any) => items.items.length && (
                            <Grid item container>
                                <Typography
                                    style={{
                                        fontWeight: 'bold',
                                        textDecoration: 'underline',
                                    }}
                                >
                                    {items.title}
                                </Typography>

                                <Divider className={classes.divider} />

                                {items
                                    .items.map((acc: any) => (
                                        <Grid
                                            container={true}
                                        >
                                            <Grid
                                                item
                                                xs

                                                style={{
                                                    fontWeight: 'bold',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <span>
                                                    {option.filter((item: any) => item.name === acc.name && item.option === items.title).length} X
                                                </span>
                                            </Grid>


                                            <Grid
                                                item
                                                xs
                                                style={{
                                                    fontWeight: 'bold',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <Typography
                                                    className={clsx(classes.itemPrice)}
                                                    align="left"
                                                >
                                                    {acc.name}
                                                </Typography>

                                            </Grid>

                                            <Grid
                                                item
                                                style={{
                                                    fontWeight: 'bold',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <Typography
                                                    className={clsx(classes.itemPrice)}
                                                    align="left"
                                                >
                                                    {`€${(option
                                                        .filter((item: any) => item.name === acc.name && item.option === items.title)
                                                        .map((item: any) => +item.amount)
                                                        .reduce((a: any, b: any) => a + b) *
                                                        option.filter((item: any) => item.name === acc.name && item.option === items.title).length / 100).toLocaleString(undefined, {
                                                            minimumFractionDigits: 1,
                                                        })}`}
                                                </Typography>

                                            </Grid>
                                        </Grid>
                                    ))}
                            </Grid>))}
                    </Grid>
                </>
            )}
        </>
    )
}

export default Accompagnement
