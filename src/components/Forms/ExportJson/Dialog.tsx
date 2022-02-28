import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Accordion from '@material-ui/core/Accordion';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { useSnackbar } from 'notistack';
import useStyles from './Style';
import { exportPdf, importJSON } from "../../../services/ImportExportPDF";
import exportJSON from "../../../services/exportJSON";
import BackupIcon from '@material-ui/icons/Backup';


interface IDialogJson {
    open: boolean;
    setOpen: (bool: boolean) => void;
    idRetaurant: string;
    name: string;
}

const DialogExportJson: FC<IDialogJson> = ({ open, setOpen, idRetaurant, name }) => {
    const { enqueueSnackbar } = useSnackbar();

    const handleClose = () => {
        setOpen(!open)
    }

    const classes = useStyles();

    const [value, setValue] = useState<any>({
        Restaurant: true
    });

    const [isLoading, setisLoading] = useState(false);

    const [uploaded, setUploaded] = useState<any>({})

    const listExport = [
        {
            "label": "Restaurants",
        },
        {
            "label": "Plat",
        },
        {
            "label": "Accompagnement",
        },
        {
            "label": "Menu",
        },
        {
            "label": "Type",
        }
    ];

    const handleToggle = (data: any) => () => {

        const update = {
            ...value,
            [data]: !(!!(value as any)[data as any]) as any
        }

        setValue(update);

    }

    const exporterLesDonnes = async () => {

        setisLoading(true);

        await exportPdf({
            id: idRetaurant,
            filter: { ...value }
        }).then((res: any) => {

            for (let i = 0; i < listExport.length; i++) {

                if (value[listExport[i].label]) {

                    exportJSON(`${listExport[i].label} ${name}`, res.data[listExport[i].label])

                }

            }

        }).catch((err: any) => {
            enqueueSnackbar("une erreur est survenue . ", {
                variant: 'error',
            });
        }).finally(() => {
            setisLoading(false);
        });

    }

    const handleUpload = (e: any) => {

        const upload = e.target.files[0]

        const fileReader: any = new FileReader();

        fileReader.onloadend = () => {

            try {
                setUploaded({
                    ...uploaded,
                    [e.target.name]: JSON.parse(fileReader.result)
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

    const submitImport = async (e: any) => {

        setisLoading(true);

        await importJSON({
            ...uploaded,
            idRetaurant: idRetaurant
        }).then((res: any) => {
            enqueueSnackbar("**Fichier import", {
                variant: 'success',
            });
        }).catch((err: any) => {
            enqueueSnackbar("une erreur est survenue . ", {
                variant: 'error',
            });
        }).finally(() => {
            setisLoading(false);
        })

    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{name}</DialogTitle>
                <DialogContent>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <ListItem button>
                                <ListItemIcon>
                                    <CloudDownloadIcon />
                                </ListItemIcon>
                                <ListItemText primary="Exporter les données" />
                            </ListItem>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List className={classes.root}>
                                {listExport.map((item: any, index: number) =>
                                    < ListItem key={index} role={undefined} dense button
                                        onClick={handleToggle(item.label)}
                                    >
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={(!!(value as any)[item.label as any])}
                                                tabIndex={-1}
                                                disableRipple
                                                inputProps={{ 'aria-labelledby': item.label }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={item.label} primary={item.label} />
                                    </ListItem>
                                )}
                            </List>

                        </AccordionDetails>

                        {isLoading ? (<CircularProgress />) : (
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                endIcon={<CloudDownloadIcon />}
                                onClick={exporterLesDonnes}
                            >
                                Exporter
                            </Button>
                        )}

                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"

                        >
                            <ListItem button>
                                <ListItemIcon>
                                    <OpenInBrowserIcon />
                                </ListItemIcon>
                                <ListItemText primary="Importer les données" />
                            </ListItem>
                        </AccordionSummary>
                        <AccordionDetails>

                            <div style={{
                                width: "50vh",
                            }}>

                                {listExport.map((item: any, index: number) =>
                                    <Grid container={true}
                                        style={{
                                            margin: "2vh 0"
                                        }}
                                    >
                                        <Grid item={true} xs={12}>
                                            <label>
                                                {item.label}
                                            </label>
                                            <br />
                                            <br />
                                            <input
                                                key={index}
                                                type="file"
                                                name={item.label}
                                                onChange={handleUpload}
                                            />
                                            <br />
                                        </Grid>
                                    </Grid>
                                )}
                                <br />

                                {isLoading ? (<CircularProgress />) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        endIcon={<BackupIcon />}
                                        onClick={submitImport}
                                    >
                                        Importer
                                    </Button>
                                )}

                            </div>

                        </AccordionDetails>
                    </Accordion>

                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        color="primary"
                        variant="contained"
                        disabled={isLoading}
                    >
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}


export default DialogExportJson;