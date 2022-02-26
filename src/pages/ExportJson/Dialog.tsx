import React, { FC, useState, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import { useSnackbar } from 'notistack';
import useStyles from './Style';
import { importJSONRestaurant } from "../../services/ImportExportPDF";
import exportJSON from "../../services/exportJSON";
import BackupIcon from '@material-ui/icons/Backup';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';



interface IDialogJson {
    open: boolean;
    setOpen: (bool: boolean) => void;
    setLoading: (bool: boolean) => void;
    retaurant: any[];
    fetch: () => void;
}

const DialogExportJson: FC<IDialogJson> = ({ open, setOpen, retaurant, setLoading, fetch }) => {

    const { enqueueSnackbar } = useSnackbar();

    const handleClose = () => {
        setOpen(!open)
    }

    const classes = useStyles();

    const hiddenFileInput = useRef<any>({});

    const handleClick = () => {

        hiddenFileInput.current.click();
    };

    const exporterLesDonnes = async () => {

        exportJSON("Retaurants", retaurant)

    }

    const handleUpload = async (e: any) => {

        const upload = e.target.files[0];

        const fileReader: any = new FileReader();

        fileReader.onloadend = async () => {

            try {

                setLoading(true);

                const json = JSON.parse(fileReader.result)

                await importJSONRestaurant(json).then(() => {
                    fetch();
                    setOpen(false);
                    setLoading(false);
                }).catch(() => {
                    setLoading(false);
                    enqueueSnackbar("Une erreur est survenue ", {
                        variant: 'error',
                    });
                })


            } catch (e) {
                enqueueSnackbar("**Fichier JSON non valide !**", {
                    variant: 'error',
                });
            }
        }

        if (upload !== undefined)
            fileReader.readAsText(upload);
    }



    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <Grid
                    container={true}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item={true} xs={6} onClick={handleClick}>
                        <Paper style={{
                            padding: "5vh",
                            cursor: "pointer"
                        }}>
                            <BackupIcon />
                            <Typography>
                                Importer
                            </Typography>
                            <input
                                type="file"
                                name="fileUpload"
                                onChange={handleUpload}
                                ref={hiddenFileInput}
                                style={{
                                    display: "none"
                                }}
                            />

                        </Paper>
                    </Grid>
                    <Grid item={true} xs={6} onClick={exporterLesDonnes}>
                        <Paper
                            style={{
                                padding: "5vh",
                                cursor: "pointer"
                            }}
                        >
                            <CloudDownloadIcon />
                            <Typography>
                                Exporter
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Dialog>
        </div>
    );
}


export default DialogExportJson;