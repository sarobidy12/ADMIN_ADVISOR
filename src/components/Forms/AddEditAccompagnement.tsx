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
import InputAccopagment from '../../components/DND/InputAccopagment';
import IOSSwitch from '../Common/IOSSwitch';

interface AddEditAccompagnementProps {
    initialValues?: any;
    submit?: (e: any) => void;
    index: number;
    onCancel: () => void;
    updateList: (data: any) => void;
    list: any[];
    accompagnement: any[];
    restaurant: string;
}

const AddEditAccompagnement: React.FC<AddEditAccompagnementProps> = ({
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
    restaurant,
    accompagnement,
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

                return priority.filter((item: any) => item.restaurant._id === restaurant);

            }

        }

        console.log("restaurant---", restaurant);

        return a.filter((item: any) => item.restaurant._id === restaurant);

    }
    const handleChange = (e: any) => {

        const { name, value } = e.target;

        setCurrent({
            ...current,
            [name]: value
        });

    }

    const setAccompagnement = () => {

        let newCard: any[] = list;
        newCard[index] = current;
        updateList(newCard);
        onCancel();

    }

    const setAccompagnementItem = (e: any) => {

        setCurrent({
            ...current,
            items: e
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
                setAccompagnement()
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
                        Nombre Maximum
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
                        Accompagnement
                    </Typography>

                    <InputAccopagment
                        listMenu={priority(accompagnement, current.items.map((e: any) => e._id)).map((item: any, i: any) => { return { id: i + 1, ...item } })}
                        disabled={false}
                        setMenu={setAccompagnementItem}
                        value={priority(accompagnement, current.items.map((e: any) => e._id)).filter((item: any) =>
                            current.items.find((d: any) => item._id === d._id),
                        )}
                    />

                    {(current.items.length > 0) && (
                        <div
                            style={{
                                margin: '2vh 0'
                            }}
                        >
                            <Typography variant="h4" gutterBottom>Prix accompagment</Typography>

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
                                        value={item.price.amount / 100 || ""}
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

export default AddEditAccompagnement;
