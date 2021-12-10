import { useState, FC } from 'react';
import {
    FormControlLabel,
    Grid,
    TextField,
    Typography,
    InputAdornment,
    Button
} from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import IOSSwitch from '../../Common/IOSSwitch';
import InputChipCodePromo from '../../Common/InputChipCodePromo';
import FormDialog from '../../Common/FormDialog';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useSnackbar } from 'notistack';

interface Iprops {
    isView: boolean;
    setValue: (e: any) => void;
    title: string;
    values: any;
    type: string;
    code?: boolean;
}

const ComponentForm: FC<Iprops> = (props: any) => {

    const { isView, setValue, title, values, type, code } = props as Iprops;

    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [current, setCurrent] = useState<any>({
        date: new Date(),
        discountIsPrice: false,
    });

    const onchange = (e: any) => {

        const { name, value, checked } = e.target;

        setCurrent({
            ...current,
            [name]: (checked || value)
        });

    }

    const { enqueueSnackbar } = useSnackbar();

    const addCodePromo = (e: any) => {

        const array: any[] = values.discount[type] || [];

        if (array.length > 0 && array.filter((item: any) => item.code === e).length > 0) {
            enqueueSnackbar("Erreur lors de l'ajout", {
                variant: 'error',
            });
            return
        }

        setCurrent({
            code: e,
            date: new Date(),
            discountIsPrice: false
        })

        setOpenModal(true)
    }

    const addInList = () => {

        let array: any[] = values?.discount?.[type] ? values?.discount?.[type] : [];

        if (current.updated) {

            console.log("current", current);

            array = array.map((item: any) => {
                if (item.code === current.name) {
                    return current
                }
                else {
                    return item
                }
            })

        }

        if (!current.updated) {
            array.push({ ...current });
        }

        const discount = {
            ...values.discount,
            [type]: array
        }

        setValue({
            ...values,
            discount: discount
        });

        setCurrent({
            date: new Date(),
            discountIsPrice: false,
        })

        setOpenModal(false)

    }

    const deleteUpdate = (data: any[]) => {

        const discount = {
            ...values.discount,
            [type]: data
        }

        setValue({
            ...values,
            discount: discount
        });

    }

    const updatedCodePromo = (data: any) => {
        setCurrent({
            ...data,
            name: data.code,
            updated: true
        });
        setOpenModal(true)
    }

    return (<>

        {isView && (
            <div style={{
                border: '1px dashed #CDCDCD',
                width: '100%',
                margin: '1vh 0',
                padding: '2vh'
            }}>
                <Grid item xs={12}>

                    <div
                        style={{
                            cursor: 'pointer'
                        }}
                        onClick={() => setOpen(!open)}
                    >

                        <Grid container={true}>

                            <Grid item xs>
                                <Typography variant="h6" style={{ fontWeight: 'bold' }} gutterBottom>
                                    {title}
                                </Typography>
                            </Grid>

                            <Grid item>
                                {open ? <ExpandLess /> : <ExpandMore />}
                            </Grid>

                        </Grid>

                    </div>


                    <Collapse in={open}>

                        <InputChipCodePromo
                            value={values.discount.codeDiscount || []}
                            updateValue={addCodePromo}
                            updateDelete={deleteUpdate}
                            name="code"
                            updatedCodePromo={updatedCodePromo}
                        />

                    </Collapse>

                </Grid>

                <FormDialog
                    title={`Ajouter un code `}
                    open={openModal}
                    fullScreen={false}
                    onClose={() => {
                        setOpenModal(false)
                    }}
                >

                    {current.updated && <>

                        <Grid container={true}>

                            <Grid item xs>
                                <Typography variant="h6" style={{ fontWeight: 'bold' }} gutterBottom>
                                    Code Promo
                                </Typography>
                            </Grid>

                            <Grid item >
                                <Typography style={{ fontWeight: 'bold' }} gutterBottom>
                                    (Nombre utilisation : {current.nbrUse || 0})
                                </Typography>
                            </Grid>

                        </Grid>

                        <TextField
                            name="code"
                            type="text"
                            variant="outlined"
                            fullWidth
                            required={true}
                            defaultValue={current.code}
                            onChange={onchange}
                        />

                    </>}

                    <Typography>
                        Date fin de la remise
                    </Typography>

                    <KeyboardDatePicker
                        margin="none"
                        inputVariant="outlined"
                        style={{ width: '100%' }}
                        value={current.date}
                        required={true}
                        format="DD/MM/YYYY"
                        onChange={(date: any) => {
                            setCurrent({
                                ...current,
                                date: date?._d
                            });

                        }}
                    />

                    <Typography>
                        Nombre d'utilisation
                    </Typography>

                    <TextField
                        name="nbr"
                        type="number"
                        placeholder="000"
                        variant="outlined"
                        fullWidth
                        required={true}
                        defaultValue={current.nbr}
                        onChange={onchange}
                    />

                    <Typography>
                        Le prix
                    </Typography>

                    <TextField
                        name="value"
                        type="number"
                        placeholder="Remise"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">{current.discountIsPrice ? `€` : `%`}</InputAdornment>
                            ),
                        }}
                        variant="outlined"
                        required={true}

                        fullWidth
                        defaultValue={current.value}
                        onChange={onchange}
                    />

                    <FormControlLabel
                        control={
                            <IOSSwitch
                                defaultChecked={current.discountIsPrice}
                                onChange={onchange}
                                name="discountIsPrice"
                            />
                        }
                        label="Le remise est un prix fixe"
                    />

                    <br />
                    <br />

                    <Button
                        variant="contained"
                        color="default"
                        onClick={() => setOpenModal(false)}
                        style={{
                            margin: '0 0.75vh'
                        }}
                    >
                        Annuler
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => addInList()}
                    >
                        Enregistrer
                    </Button>

                </FormDialog>
            </div>


        )
        }

    </>)

}

export default ComponentForm;
