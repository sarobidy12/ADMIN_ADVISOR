import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Chip from '@material-ui/core/Chip';
import useStyles from './style';

interface DashboardProps {
    value: any[];
    updateValue: (data: any) => void;
    name: string;
    updatedCodePromo: (data: any) => void;
    updateDelete: (data: any[]) => void;
}

const InputChip: React.FC<DashboardProps> = ({ value, updateValue, updateDelete, name, updatedCodePromo }) => {

    const classes = useStyles();
    const [text, setUpdate] = useState("");

    const handleChangeLiraison = (e: any) => {
        const {  value } = e.target;
        setUpdate(value);
    }

    const handleAddArray = () => {
        updateValue(text);
        (document.getElementById("inputForm") && document.getElementById("inputForm") as any).value = "";
    }

    return (
        <div
            className={classes.input}
        >
            <div
                style={{
                    width: '93%',
                    display: 'inline-block',
                }}
            >

                <div
                    style={{
                        display: 'inline-block'
                    }}
                >
                    {
                        value.length > 0 && value.map((items: any, index: any) => {
                            return <Chip
                                label={`${items.code} (${items.nbrUse || 0})`}
                                key={index}
                                style={{
                                    cursor: 'pointer',
                                    margin: '0.5vh 0.5vh'
                                }}
                                onClick={(e: any) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updatedCodePromo({ ...items });
                                }}
                                onDelete={(e: any) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateDelete(value.filter((item: any) => item.code !== items.code))
                                }}
                                color={items.nbrUse >= items.nbr ? "primary" : "secondary"}
                            />
                        })
                    }
                </div>

                <div
                    style={{
                        display: 'inline-block'
                    }}
                >
                    <input
                        className={classes.inputForm}
                        name={name}
                        type="text"
                        onChange={handleChangeLiraison}
                        placeholder={name}
                        id="inputForm"
                        required
                    />
                </div>

            </div>

            <div
                style={{
                    width: '5%',
                    display: 'inline-block',
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    onClick={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddArray()
                    }}
                >
                    <AddCircleIcon />
                </Button>
            </div>

        </div>


    );
}

export default InputChip
