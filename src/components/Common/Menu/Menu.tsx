import  { FC } from 'react';
import {
    Box,
    Divider,
    Grid,
    Typography,
} from '@material-ui/core';
import 'moment/locale/fr';
import useStyles from './style';
import Foods from './Food';


export const priceMenu = (menu: any) => {

    const idMEnu: string[] = Object.keys(menu);

    const FoodsPrice = [];

    const accPrice = [];

    for (let i = 0; i < idMEnu.length; i++) {

        let menuSelect: any = menu[idMEnu[i]]

        if (menuSelect?.items.length > 0) {

            for (let p = 0; p < menuSelect?.items.length; p++) {

                let menuitemSelected: any = menuSelect?.items[p];

                FoodsPrice.push(menuitemSelected.price.amount);

                for (let op = 0; op < menuitemSelected.options.length; op++) {

                    let options = menuitemSelected.options[op];

                    for (let acc = 0; acc < options.items.length; acc++) {

                        let accmpagenement = options.items[acc];
                        accPrice.push(accmpagenement.price.amount * accmpagenement.quantity)

                    }

                }

            }

        }

    }

    const totalFood = FoodsPrice.length > 0 ? FoodsPrice.reduce((a: any, b: any) => a + b) : 0;

    const totalAcc = accPrice.length > 0 ? accPrice.reduce((a: any, b: any) => a + b) : 0;

    return totalFood + totalAcc;

};

interface IMenuState {
    menuList: any[];
}

const Menu: FC<{ menuList: any[] }> = (props: any) => {

    const classes = useStyles();

    const {
        menuList,
    } = props as IMenuState;

    return (
        <>
            {menuList.length > 0 && (

                <div className={classes.itemContainer}>

                    <Typography variant="h6" gutterBottom className="translate">
                        Les menus
                    </Typography>

                    {menuList.map((menuSelected: any) => {

                        const {
                            quantity,
                            menu,
                            item: { name, type, price },
                        } = menuSelected;

                        return (
                            <>


                                <Grid container spacing={1} alignItems="center">
                                    <Grid item>
                                        <Box width={50} textAlign="center" alignSelf="center">
                                            <span>
                                                {quantity} X
                                            </span>
                                        </Box>
                                    </Grid>
                                    <Grid item>

                                        {name}

                                        <br />

                                        <span>
                                            Total :
                                        </span>
                                        <span>
                                            {`€${(((priceMenu(menu) + (type === 'fixed_price' && price.amount))) * quantity / 100).toLocaleString(undefined, {
                                                minimumFractionDigits: 1,
                                            })}`}
                                        </span>

                                    </Grid>
                                </Grid>

                                <br />

                                <Divider />

                                {
                                    menu.map((menuItem: any) => {

                                        const {
                                            title,
                                            items
                                        } = menuItem;

                                        return (
                                            <div
                                                className={classes.optionFoods}
                                                style={{
                                                    display: 'block',
                                                }}
                                            >
                                                <Grid item={true} xs={12}>
                                                    <Grid container={true}>
                                                        <Grid item>
                                                            {title}
                                                        </Grid>
                                                    </Grid>
                                                    <br />
                                                    {
                                                        <Foods food={items} />
                                                    }
                                                </Grid>
                                            </div>
                                        )
                                    })
                                }

                            </>

                        )

                    })}

                </div>
            )}

        </>
    );
};

export default Menu;
