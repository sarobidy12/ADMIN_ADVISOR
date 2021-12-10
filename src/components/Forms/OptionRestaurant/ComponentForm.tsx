import { useState, FC } from 'react';
import {
    FormControlLabel,
    Grid,
    TextField,
    Typography,
    InputAdornment,
    Button,
    IconButton
} from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import IOSSwitch from '../../Common/IOSSwitch';
import Input from '../../Common/inputChip';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {
    AddCircle as AddCircleIcon,
    ExpandMore as ExpandMoreIcon,
    Close as Close,
} from '@material-ui/icons';


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

    const [discountIsPrice, setdiscountIsPrice] = useState(values.discount[type]?.discountIsPrice);

    const onchange = (e: any) => {

        const { name, value, checked } = e.target;

        const discount = {
            ...values.discount,
            [type]: {
                ...values.discount[type],
                [name]: name === 'discountIsPrice' ? checked : value
            }
        }

        name === 'discountIsPrice' && setdiscountIsPrice(!discountIsPrice);

        setValue({
            ...values,
            discount: discount
        });

    }


    const handlePlageChange = (e: any) => {

        const { name, value, checked } = e.target;

        const discount = {
            ...values.discount,
            [type]: {
                ...values.discount[type],
                plageDiscount: values.discount[type].plageDiscount.map((item: any) => {
                    if (+item.id === +name.split('-')[0]) {
                        return {
                            ...item,
                            [name.split('-')[1]]: checked || value
                        }

                    }
                    return item;
                })
            }
        }

        console.log("discount", discount)

        setValue({
            ...values,
            discount: discount
        });

    }

    const addNewPlage = () => {

        const list: any[] = values.discount[type].plageDiscount || [];

        list.push({
            id: values.discount[type].plageDiscount.length + 1,
            min: "",
            value: "",
            max: ""
        })

        const discount = {
            ...values.discount,
            [type]: {
                ...values.discount[type],
                plageDiscount: list
            }
        }

        setValue({
            ...values,
            discount: discount
        });

    }

    const removeList = (id: string) => {

        const discount = {
            ...values.discount,
            [type]: {
                ...values.discount[type],
                plageDiscount: values.discount[type].plageDiscount.filter((item: any) => item.id !== id)
            }
        }

        setValue({
            ...values,
            discount: discount
        });

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

                        <Grid
                            container
                            justify="flex-end"
                            alignItems="center"
                            style={{ position: 'relative' }}
                        >

                            <Grid item>
                                <Button
                                    variant="contained"
                                    startIcon={<AddCircleIcon />}
                                    color="secondary"
                                    onClick={addNewPlage}
                                >
                                    Ajouter
                                </Button>
                            </Grid>

                        </Grid>

                        {values.discount[type].plageDiscount.length ?
                            values.discount[type].plageDiscount.map((item: any) =>
                                <>
                                    <Grid container={true}>

                                        <Grid item xs>

                                            <TextField
                                                name={`${item.id}-min`}
                                                variant="outlined"
                                                type='number'
                                                fullWidth
                                                placeholder="Prix minimum"
                                                defaultValue={item?.min || ""}
                                                onChange={handlePlageChange}
                                                style={{
                                                    width: '98%',
                                                    margin: '1vh 0'
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">€</InputAdornment>
                                                    ),
                                                }}
                                            />

                                        </Grid>

                                        <Grid item xs>

                                            <TextField
                                                name={`${item.id}-max`}
                                                variant="outlined"
                                                type='number'
                                                fullWidth
                                                placeholder="Prix maximum"
                                                style={{
                                                    width: '98%',
                                                    margin: '1vh 0'
                                                }}
                                                defaultValue={item?.max || ""}
                                                onChange={handlePlageChange}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">€</InputAdornment>
                                                    ),
                                                }}
                                            />

                                        </Grid>

                                        <Grid item xs>

                                            <TextField
                                                name={`${item.id}-value`}
                                                variant="outlined"
                                                type='number'
                                                placeholder="Valeur"
                                                style={{
                                                    width: '98%',
                                                    margin: '1vh 0'
                                                }}
                                                fullWidth
                                                defaultValue={item?.value || ""}
                                                onChange={handlePlageChange}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">{!!item?.discountIsPrice ? "€" : "%"}</InputAdornment>
                                                    ),
                                                }}
                                            />

                                        </Grid>

                                        <Grid item>
                                            <IconButton key={item.id} onClick={(e: any) => {
                                                e.stopPropagation();
                                                removeList(item.id)
                                            }}>
                                                <Close />
                                            </IconButton>
                                        </Grid>

                                    </Grid>

                                    <FormControlLabel
                                        control={
                                            <IOSSwitch
                                                defaultChecked={!!item?.discountIsPrice}
                                                onChange={handlePlageChange}
                                                name={`${item.id}-discountIsPrice`}
                                            />
                                        }
                                        label="Le remise est un prix fixe"
                                    />
                                </>
                            ) : (<></>)}
                        <br />
                        <div>
                            {type === "delivery" && (<FormControl component="fieldset">
                                <FormLabel component="legend">Pour la remise</FormLabel>
                                <RadioGroup aria-label="gender" name="discountType" value={values.discount[type]?.discountType} onChange={onchange}>
                                    <FormControlLabel value="SurCommande" control={<Radio />} label="Sur la commande" />
                                    <FormControlLabel value="SurTransport" control={<Radio />} label="Sur le transport" />
                                    <FormControlLabel value="SurTotalité" control={<Radio />} label="Sur la totalité" />
                                </RadioGroup>
                            </FormControl>
                            )}
                        </div>

                    </Collapse>

                </Grid>
            </div>

        )
        }

    </>)

}

export default ComponentForm;
