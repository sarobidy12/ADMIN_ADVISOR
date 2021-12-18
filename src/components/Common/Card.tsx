import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Grid, Paper } from '@material-ui/core';
import { useAuth } from '../../providers/authentication';


const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    media: {
        height: 140,
    },
}));

interface DashboardProps {
    dashboardDay: number,
    dashboardWeek: number,
    dashboardMonth: number,
    dashboardYear: number,
    chiffreAffaireDay: number,
    chiffreAffaireWeek: number,
    chiffreAffaireMonth: number,
    chiffreAffaireYear: number,
    BestRestoDayName: string,
    BestRestoSomme: number,
    BestRestoCommande: number,
    BestRestoWeekName: string,
    BestRestoWeekSomme: number,
    BestRestoWeekCommande: number,
    BestRestoMonthName: string,
    BestRestoMonthSomme: number,
    BestRestoMonthCommande: number,
    BestRestoYearName: string,
    BestRestoYearSomme: number,
    BestRestoYearCommande: number
}

const MediaCard: React.FC<DashboardProps> = ({
    dashboardDay,
    dashboardWeek,
    dashboardMonth,
    dashboardYear,
    chiffreAffaireDay,
    chiffreAffaireWeek,
    chiffreAffaireMonth,
    chiffreAffaireYear,
    BestRestoDayName,
    BestRestoSomme,
    BestRestoCommande,
    BestRestoWeekName,
    BestRestoWeekSomme,
    BestRestoWeekCommande,
    BestRestoMonthName,
    BestRestoMonthSomme,
    BestRestoMonthCommande,
    BestRestoYearName,
    BestRestoYearSomme,
    BestRestoYearCommande
}) => {
    const classes = useStyles();

    const { isAdmin } = useAuth();

    return (
        <Paper className={classes.root}>
            <h2>Nombre de commandes</h2>
            <Grid container spacing={2} >
                <Grid item xs={6} sm={3}>
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    <span>Aujourd'hui:<b> {dashboardDay}</b></span>
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    <span>Cette semaine: <b>{dashboardWeek}</b></span>
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    <span>Cet mois: <b>{dashboardMonth}</b></span>
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    <span>Cette annee: <b>{dashboardYear}</b></span>
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>

            <h2>Chiffre d'affaire</h2>
            <Grid container spacing={2} >
                <Grid item xs={6} sm={3}>
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    <span>Aujourd'hui: <b> € {(chiffreAffaireDay / 100)}</b></span>
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    <span>Cette semaine: <b> € {(chiffreAffaireWeek / 100)} </b></span>
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    <span>Cet mois: <b> € {(chiffreAffaireMonth / 100)}</b></span>
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card className={classes.root}>
                        <CardActionArea>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    <span>Cette annee: <b> € {(chiffreAffaireYear / 100)}</b></span>
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>

            {
                isAdmin && (
                    <div>
                        <h2>Meilleur Restaurant</h2>
                        <Grid container spacing={2} >
                            <Grid container spacing={2} sm={12}>
                                <Grid item xs={6} sm={4}>
                                    <Card className={classes.root}>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    <span>Aujourd'hui:<b> {BestRestoDayName}</b></span>
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Card className={classes.root}>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    <span>Nombre commande total: <b>{BestRestoCommande}</b></span>
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Card className={classes.root}>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    <span>Total :  <b> € {(BestRestoWeekSomme ? BestRestoWeekSomme / 100 : 0)}</b></span>
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} sm={12}>
                                <Grid item xs={6} sm={4}>
                                    <Card className={classes.root}>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    <span>Cette semaine:<b> {BestRestoWeekName}</b></span>
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Card className={classes.root}>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    <span>Nombre commande total: <b>{BestRestoWeekCommande}</b></span>
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Card className={classes.root}>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    <span>Total :  <b> € {(BestRestoWeekSomme ? BestRestoWeekSomme / 100 : 0)}</b></span>

                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} sm={12}>
                                <Grid item xs={6} sm={4}>
                                    <Card className={classes.root}>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    <span>Cette mois: <b>{BestRestoMonthName}</b></span>
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Card className={classes.root}>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    <span>Nombre commande total: <b> {BestRestoMonthCommande}</b></span>
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Card className={classes.root}>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    <span>Total :  <b> € {(BestRestoMonthSomme ? BestRestoMonthSomme / 100 : 0)}</b></span>
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} sm={12}>
                                <Grid item xs={6} sm={4}>
                                    <Card className={classes.root}>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    <span>Cette annee:<b> {BestRestoYearName}</b></span>
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Card className={classes.root}>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    <span>Nombre commande total: <b>{BestRestoYearCommande}</b></span>
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Card className={classes.root}>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    <span>Total :  <b> € {(BestRestoYearSomme ? BestRestoYearSomme / 100 : 0)} </b></span>
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            </Grid>

                        </Grid>

                    </div>
                )
            }
        </Paper>
    );
}

export default MediaCard
