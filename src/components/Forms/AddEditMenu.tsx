import React, { useState } from 'react';
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    FormControlLabel,
} from '@material-ui/core';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import InputMenu from '../DND/InputMenu';
import IOSSwitch from '../Common/IOSSwitch';

interface AddEditMenuProps {
    initialValues?: any;
    submit?: (e: any) => void;
    index: number;
    onCancel: () => void;
    updateList: (data: any) => void;
    list: any[];
    listMenu: any[];
    isPriceFix: boolean;
    updatePlat: (data: any) => void;
}

const AddEditMenu: React.FC<AddEditMenuProps> = ({
    initialValues = {
        title: '',
        maxOptions: '0',
        items: [],
        isObligatory: false
    },
    index,
    onCancel,
    updateList,
    list,
    listMenu,
    isPriceFix,
    updatePlat,
}) => {

    const [current, setCurrent] = useState<any>({
        ...initialValues,
    });

    const priority = (a: any[], b: any[]) => {

        const array = [];

        if (b.length > 0) {

            for (let i = 0; i < b.length; i++) {
                array.push(a.filter((items: any) => items._id === b[i])[0])
            }

            const priority = [...array].concat(a.filter((items: any) => !b.includes(items._id)));

            if (priority.filter((item: any) => item).length) {
                return priority;
            }

        }

        return a;

    }
    const handleChange = (e: any) => {

        const { name, value } = e.target;

        setCurrent({
            ...current,
            [name]: value
        });

    }

    const setAccompagnement = () => {

        const newList = list.map((item: any, index_id: number) => {

            if (index_id === index) {
                return {
                    ...current,
                    items: current.items
                };
            }

            return item;

        })

        updateList([...newList]);

        onCancel();

        setCurrent({ ...initialValues })

    }

    const setAccompagnementItem = (e: any) => {

        setCurrent({
            ...current,
            items: e.map((item: any) => {
                return {
                    ...item,
                    price: {
                        amount: 0,
                        currency: "eur"
                    }
                }
            })
        })

    }

    const handlePriceChange = (e: any) => {

        const { name, value } = e.target;

        setCurrent({
            ...current,
            items: current.items.map((item: any) => {

                if (item._id === name) {
                    let curr = item;
                    curr.price.amount = value * 100;
                    return curr
                }

                return item;

            })
        });

    }

    const getPlatUPdated = (data: any) => {
        updatePlat(listMenu.find((item: any) => item._id === data))
    }

    return (
        <form
            noValidate
            method="post"
            encType="multipart/form-data"
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                (e.currentTarget.querySelector(
                    '[type=submit]',
                ) as HTMLButtonElement).focus();
                setAccompagnement();
                //   if (validate()) onSave?.(values);
            }}
        >
            <div style={{
                width: '80%',
                margin: '0 auto'
            }}>
                <Grid container spacing={6}>

                    <Typography variant="h5" gutterBottom>
                        Nom
                    </Typography>

                    <TextField
                        name="title"
                        placeholder="Titre"
                        variant="outlined"
                        fullWidth
                        value={current?.title || ''}
                        onChange={handleChange}
                    />

                    <Typography variant="h5" gutterBottom>
                        Max option
                    </Typography>

                    <TextField
                        name="maxOptions"
                        variant="outlined"
                        fullWidth
                        type='number'
                        value={current?.maxOptions || ''}
                        onChange={handleChange}
                    />

                    <Typography variant="h5" gutterBottom>
                        Plat
                    </Typography>

                    <InputMenu
                        listMenu={priority(listMenu, current.items.map((e: any) => e._id)).map((item: any, i: any) => { return { id: i + 1, ...item } })}
                        disabled={false}
                        setMenu={setAccompagnementItem}
                        value={priority(listMenu, current.items.map((e: any) => e._id)).filter((item: any) => current.items.find((d: any) => item._id === d._id))}
                        onclick={getPlatUPdated}
                    />

                    {(isPriceFix) && (current.items.length > 0) && (

                        <div
                            style={{
                                margin: '2vh 0'
                            }}
                        >
                            <Typography variant="h4" gutterBottom>Prix additionnel par plat</Typography>

                            {current.items.map((item: any) =>
                                <>
                                    <Typography variant="h5" gutterBottom>
                                        {item.name}
                                    </Typography>
                                    <TextField
                                        name={item._id}
                                        variant="outlined"
                                        type='number'
                                        fullWidth
                                        value={(item.price.amount / 100) || ""}
                                        onChange={handlePriceChange}
                                        InputProps={{
                                            startAdornment: <EuroSymbolIcon />,
                                        }}
                                    />
                                </>
                            )}

                        </div>

                    )}

                    <Grid
                        xs={12}
                        spacing={2}
                    >
                        <FormControlLabel
                            control={
                                <IOSSwitch
                                    defaultChecked={current.isObligatory}
                                    onChange={(e: any) => {
                                        setCurrent({
                                            ...current,
                                            isObligatory: e.target.checked
                                        });
                                    }}
                                    name="isObligatory"
                                />
                            }
                            label="Obligatoire"
                        />

                    </Grid>

                    <Grid
                        item
                        container
                        justify="flex-end"
                        alignItems="center"
                        xs={12}
                        spacing={2}
                    >
                        <Button
                            variant="contained"
                            color="default"
                            onClick={onCancel}
                        >
                            Annuler
                        </Button>
                        <Box width={10} />
                        <Button variant="contained" color="primary" type="submit">
                            Enregistrer
                        </Button>
                    </Grid>

                </Grid>
            </div>
        </form>
    );
};

export default AddEditMenu;
