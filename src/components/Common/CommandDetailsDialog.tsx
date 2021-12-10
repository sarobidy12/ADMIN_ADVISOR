import React from 'react';
import {
  AppBar,
  Avatar,
  Button,
  Chip,
  Container,
  Dialog,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  makeStyles,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import Command from '../../models/Command.model';
import {
  Block,
  Check,
  Close as CloseIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
} from '@material-ui/icons';
import { green, orange, red } from '@material-ui/core/colors';
import clsx from 'clsx';
import SlideTransition from '../Transitions/SlideTransition';
import NumberFormatter from '../../utils/NumberFormatter';
import DateFormatter from '../../utils/DateFormatter';
import { revokeCommand, validateCommand, CommandLivre } from '../../services/commands';
import { useSnackbar } from 'notistack';
import PriceFormatter from '../../utils/PriceFormatter';
import EventEmitter from '../../services/EventEmitter';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import Menu from './Menu';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(14),
  },
  restaurantImage: {
    width: 50,
    height: 50,
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  commandId: {
    color: theme.palette.primary.main,
  },
  status: {
    backgroundColor: orange[400],
    color: 'white',
    '&.active': {
      backgroundColor: green[400],
    },
    '&.revoked': {
      backgroundColor: red[400],
    },
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Work Sans',
  },
  totalPrice: {
    fontSize: 18,
    color: theme.palette.primary.main,
    fontFamily: 'Work Sans',
  },
  optionFoods: {
    marginTop: theme.spacing(1),
    paddingLeft: theme.spacing(14),
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(1),
      paddingLeft: theme.spacing(0),
    },
  },
}));

interface CommandDetailsDialogProps {
  command?: Command;
  open: boolean;
  onClose: () => void;
}

const CommandDetailsDialog: React.FC<CommandDetailsDialogProps> = ({
  command,
  open,
  onClose,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const Emporter = (_id: any) => {

    CommandLivre(_id)
      .then(() => {
        enqueueSnackbar('Commande emportée', {
          variant: 'success',
        });

        EventEmitter.emit('REFRESH_NAVIGATION_BAR');
        onClose();

      })
      .catch(() => {
        enqueueSnackbar('Erreur lors de la validation', {
          variant: 'error',
        });
      });
  }


  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      TransitionComponent={SlideTransition}
      scroll="body"
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => onClose()}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Détails de la commande
          </Typography>
          {command &&
            command.commandType !== 'on_site' && !command.validated &&
            (!mdDown ? (
              <>
                {!command.hasDelivery && (<Button
                  color="inherit"
                  onClick={() => {
                    command && Emporter(command._id)
                  }}
                >
                  {command.commandType === "delivery" ? "Faire la livraison" : "La commande emporter"}
                </Button>)}


                <Button
                  color="inherit"
                  onClick={() => {
                    command &&
                      validateCommand(command._id)
                        .then(() => {
                          enqueueSnackbar('Commande validée', {
                            variant: 'success',
                          });
                          EventEmitter.emit('REFRESH_NAVIGATION_BAR');
                          onClose();
                        })
                        .catch(() => {
                          enqueueSnackbar('Erreur lors de la validation', {
                            variant: 'error',
                          });
                        });
                  }}
                >
                  Valider la commande
                </Button>
                {!command.revoked && (<Button
                  color="inherit"
                  onClick={() => {
                    command &&
                      revokeCommand(command._id)
                        .then(() => {
                          enqueueSnackbar('Commande refusée', {
                            variant: 'info',
                          });
                          EventEmitter.emit('REFRESH_NAVIGATION_BAR');
                          onClose();
                        })
                        .catch(() => {
                          enqueueSnackbar(
                            'Erreur lors du refus de la commande',
                            {
                              variant: 'error',
                            },
                          );
                        });
                  }}
                >
                  Refuser la commande
                </Button>)}
              </>
            ) : (
              <>
                <Tooltip title="Valider">
                  <IconButton
                    color="inherit"
                    onClick={() => {
                      command &&
                        validateCommand(command._id)
                          .then(() => {
                            enqueueSnackbar('Commande validée', {
                              variant: 'success',
                            });
                            EventEmitter.emit('REFRESH_NAVIGATION_BAR');
                            EventEmitter.emit('REFRESH');
                            onClose();
                          })
                          .catch(() => {
                            enqueueSnackbar('Erreur lors de la validation', {
                              variant: 'error',
                            });
                          });
                    }}
                  >
                    <Check />
                  </IconButton>
                </Tooltip>
                {!command.revoked && (<Tooltip title="Refuser">
                  <IconButton
                    color="inherit"
                    onClick={() => {
                      command &&
                        revokeCommand(command._id)
                          .then(() => {
                            enqueueSnackbar('Commande refusée', {
                              variant: 'info',
                            });
                            EventEmitter.emit('REFRESH_NAVIGATION_BAR');
                            EventEmitter.emit('REFRESH');
                            onClose();
                          })
                          .catch(() => {
                            enqueueSnackbar(
                              'Erreur lors du refus de la commande',
                              {
                                variant: 'error',
                              },
                            );
                          });
                    }}
                  >
                    <Block />
                  </IconButton>
                </Tooltip>)}
              </>
            ))}
        </Toolbar>
      </AppBar>
      {command && (
        <Container maxWidth="md" className={classes.root}>
          <Grid container direction="column">
            <Divider className={classes.divider} />

            {command.restaurant && (
              <>
                <Grid item container spacing={2} alignItems="center">
                  <Grid item>

                    {
                      command.restaurant.logo ?
                        (<Avatar
                          src={command.restaurant.logo}
                          alt={command.restaurant.name}
                          className={classes.restaurantImage}
                        />) : (
                          <FastfoodIcon
                            className={classes.restaurantImage}
                          />
                        )
                    }

                  </Grid>
                  <Grid item xs container direction="column">
                    <Grid item>
                      <Typography style={{
                        color: 'black',
                        fontSize: '1vh'
                      }}>
                        {command.restaurant.name}
                      </Typography>
                    </Grid>
                    <Grid item container alignItems="center">
                      <Grid item>
                        <LocationOnIcon fontSize="small" />
                      </Grid>
                      <Grid item xs>
                        <Typography variant="h6" style={{
                          color: 'black',
                          fontSize: '1vh'
                        }}>
                          {command.restaurant.address}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container alignItems="center">
                      <Grid item>
                        <PhoneIcon fontSize="small" />
                      </Grid>
                      <Grid item xs>
                        <Typography
                          variant="h6"
                          component="a"
                          style={{
                            color: 'black',
                            fontSize: '1vh'
                          }}
                          href={`tel:${command.restaurant.phoneNumber}`}
                        >
                          {command.restaurant.phoneNumber}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Divider className={classes.divider} />
              </>
            )}



            <Divider className={classes.divider} />

            <Grid item container justify="space-between">
              <Grid item>
                <Typography variant="h6" component="p">
                  {'ID de commande: '}
                  <span className={classes.commandId}>
                    {NumberFormatter.format(command.code, {
                      minimumIntegerDigits: 6,
                    })}
                  </span>
                </Typography>
              </Grid>
              <Grid item>
                {command.hasDelivery && <Chip

                  style={{
                    margin: '0 1vh'
                  }}

                  className={clsx(classes.status, {
                    active: command.hasDelivery,
                    revoked: !!command.revoked,
                  })}

                  label={
                    <span className="translate">
                      {command.hasDelivery
                        ? command.commandType === "delivery" ? "Livraison déjà effectuer" : "La commande déjà emporter" : ""}
                    </span>
                  }

                />}

                <Chip
                  className={clsx(classes.status, {
                    active: !!command.validated,
                    revoked: !!command.revoked,
                  })}
                  label={
                    <span className="translate">
                      {command.validated
                        ? 'Validée'
                        : command.revoked
                          ? 'Refusée'
                          : 'En attente'}
                    </span>
                  }
                />
              </Grid>
            </Grid>

            <Divider className={classes.divider} />

            {!!command.items?.length && (
              <List
                subheader={
                  <ListSubheader className="translate">
                    Liste des plats commandés
                  </ListSubheader>
                }
              >

                {command.items.map((food: any) => {
                  const {
                    item: {
                      imageURL,
                      name,
                      price: { amount },
                    },
                    options,
                    quantity,
                  } = food;

                  let quantity_food = quantity;

                  return (
                    <>
                      <ListItem>
                        <ListItemAvatar>
                          <Grid container alignItems="center">
                            <Typography style={{ width: 40 }} align="center">
                              {quantity} X
                            </Typography>
                            {imageURL ? (
                              <Avatar src={imageURL} alt={name.fr} />
                            ) : (
                              <FastfoodIcon />
                            )}
                          </Grid>
                        </ListItemAvatar>
                        <ListItemText style={{ marginLeft: theme.spacing(2) }}>
                          <Grid item container justify="space-between">
                            <Grid item>
                              <Typography
                                align="left"
                              >
                                {name.fr}<br />
                                {(amount || 0) !== 0 && (
                                  <Typography>{`€${(
                                    ((amount || 0)) /
                                    100
                                  ).toLocaleString(undefined, {
                                    minimumFractionDigits: 1,
                                  })}`}</Typography>
                                )}
                              </Typography>
                            </Grid>
                            <Grid item>
                              {(amount || 0) * quantity !== 0 && (
                                <Typography>{`€${(
                                  ((amount || 0) * quantity) /
                                  100
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 1,
                                })}`}</Typography>
                              )}
                            </Grid>
                          </Grid>
                        </ListItemText>
                      </ListItem>

                      <Divider />

                      <Grid
                        item
                        container
                        className={classes.optionFoods}
                        direction="column"
                      >
                        {options.map(
                          (optionIten: any) => {
                            const { items, title } = optionIten;
                            return !!items.length && (
                              <Grid item container>
                                <Typography style={{ fontWeight: 'bold' }}>
                                  {title}
                                </Typography>
                                <Grid
                                  container
                                  alignItems="center"
                                  justify="space-between"
                                >
                                  <Grid item container xs direction="column">
                                    {items.map((itemItems: any) => {

                                      const { item, quantity, price } = itemItems;


                                      return <Grid
                                        item
                                        xs
                                        container
                                        style={{
                                          paddingLeft: theme.spacing(4),
                                        }}
                                      >
                                        <Grid item style={{ fontWeight: 'bold' }}>
                                          {quantity} X
                                        </Grid>
                                        <Grid
                                          item
                                          style={{
                                            marginLeft: theme.spacing(2),
                                          }}
                                        >
                                          <Typography
                                            align="left"
                                            className={classes.itemPrice}
                                          >
                                            {item.name}<br />

                                            {`€${(price?.amount / 100).toLocaleString(undefined, { minimumFractionDigits: 1 })}`}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    })
                                    }
                                  </Grid>
                                  {(items.reduce((p: any, c: any) => p + c.quantity * (c.price?.amount || 0), 0) / 100) !== 0 && (<Grid item>
                                    {!!(
                                      items.reduce(
                                        (p: any, c: any) =>
                                          p +
                                          c.quantity *
                                          quantity_food *
                                          (c.price?.amount || 0),
                                        0
                                      ) / 100
                                    ) && (
                                        <Typography
                                          align="left"
                                          className={classes.itemPrice}
                                        >{`€${(
                                          items.reduce(
                                            (p: any, c: any) =>
                                              p +
                                              c.quantity *
                                              quantity_food *
                                              (c.price?.amount || 0),
                                            0
                                          ) / 100
                                        ).toLocaleString(undefined, {
                                          minimumFractionDigits: 1,
                                        })}`}</Typography>
                                      )}
                                  </Grid>)}
                                </Grid>
                              </Grid>
                            )
                          }
                        )}
                      </Grid>
                    </>
                  );
                })}
              </List>
            )}

            {!!command.menus.filter((data: any) => data.item).length && (
              <>
                <List
                  subheader={
                    <ListSubheader
                      className="translate"
                      disableGutters
                      disableSticky
                    >
                      Liste des menus commandés
                    </ListSubheader>
                  }
                >
                  {command.menus.map(
                    ({
                      foods,
                      quantity,
                      item: {
                        imageURL,
                        price,
                        type,
                        foods: foodsInMenu,
                        name: { fr: name },
                      },
                    }) => {
                      const fixedPrice = type === 'fixed_price',
                        priceless = type === 'priceless';


                      return (
                        <React.Fragment key={name}>
                          <Divider />

                          <ListItem disableGutters>
                            <ListItemAvatar>
                              <Grid container alignItems="center">
                                <Typography
                                  style={{ width: 40 }}
                                  align="center"
                                >
                                  {quantity}
                                </Typography>

                                {
                                  imageURL ? (
                                    <Avatar src={imageURL} alt={name}>
                                      {name.substr(0, 1)}
                                    </Avatar>
                                  ) : (
                                    <FastfoodIcon />
                                  )
                                }

                              </Grid>
                            </ListItemAvatar>
                            <ListItemText
                              style={{ marginLeft: theme.spacing(2) }}
                            >
                              <Grid container justify="space-between">
                                <Grid item>
                                  <Typography>{name}</Typography>
                                </Grid>
                                {fixedPrice && (
                                  <Grid item>
                                    <Typography>
                                      {`PU: ${PriceFormatter.format(price)}`}
                                    </Typography>
                                  </Grid>
                                )}
                              </Grid>
                            </ListItemText>
                          </ListItem>

                          <Divider />

                          <div
                            style={{
                              marginLeft: theme.spacing(14),
                              marginBottom: theme.spacing(2),
                            }}
                          >
                            {foods.map(
                              ({
                                options,
                                food: {
                                  _id,
                                  imageURL,
                                  name: { fr: name },
                                  price,
                                },
                              }) => {
                                const foodInMenu = foodsInMenu.find(
                                  ({ food: f }) => f._id === _id,
                                );

                                return (
                                  <React.Fragment key={_id}>
                                    <ListItem disableGutters>
                                      <ListItemAvatar>
                                        {
                                          imageURL ? (
                                            <Avatar src={imageURL} alt={name} />
                                          ) : (
                                            <FastfoodIcon />
                                          )}
                                      </ListItemAvatar>
                                      <ListItemText
                                        style={{ marginLeft: theme.spacing(2) }}
                                      >
                                        <Grid container justify="space-between">
                                          <Grid item>
                                            <Typography>{name}</Typography>
                                          </Grid>
                                          {!priceless && (
                                            <Grid item>
                                              <Typography>
                                                {`${!fixedPrice
                                                  ? `PU: ${PriceFormatter.format(
                                                    price,
                                                  )}`
                                                  : ''
                                                  }${fixedPrice &&
                                                    !!foodInMenu &&
                                                    !!foodInMenu.additionalPrice
                                                      .amount
                                                    ? ` + ${PriceFormatter.format(
                                                      foodInMenu.additionalPrice,
                                                    )}`
                                                    : ''
                                                  }`}
                                              </Typography>
                                            </Grid>
                                          )}
                                        </Grid>
                                      </ListItemText>
                                    </ListItem>

                                    <Grid
                                      item
                                      container
                                      style={{ paddingLeft: theme.spacing(6) }}
                                      direction="column"
                                    >
                                      {options.map(
                                        ({ items, title }) =>
                                          !!items.length && (
                                            <Grid item container>
                                              <Typography
                                                style={{ fontWeight: 'bold' }}
                                              >
                                                {title}
                                              </Typography>
                                              {items.map(
                                                ({
                                                  item: { _id, name, price },
                                                  quantity,
                                                }) => (
                                                  <React.Fragment key={_id}>
                                                    <Grid
                                                      container
                                                      alignItems="center"
                                                      justify="space-between"
                                                    >
                                                      <Grid
                                                        item
                                                        xs
                                                        container
                                                        style={{
                                                          paddingLeft:
                                                            theme.spacing(4),
                                                        }}
                                                      >
                                                        <Grid
                                                          item
                                                          style={{
                                                            fontWeight: 'bold',
                                                          }}
                                                        >
                                                          {quantity}
                                                        </Grid>
                                                        <Grid
                                                          item
                                                          style={{
                                                            marginLeft:
                                                              theme.spacing(2),
                                                          }}
                                                        >
                                                          {name}
                                                        </Grid>
                                                      </Grid>
                                                      {!!price &&
                                                        !!price.amount && (
                                                          <Grid item>
                                                            <Typography
                                                              className={
                                                                classes.itemPrice
                                                              }
                                                            >
                                                              {`PU: ${PriceFormatter.format(
                                                                price,
                                                              )}`}
                                                            </Typography>
                                                          </Grid>
                                                        )}
                                                    </Grid>
                                                  </React.Fragment>
                                                ),
                                              )}
                                            </Grid>
                                          ),
                                      )}
                                    </Grid>
                                  </React.Fragment>
                                );
                              },
                            )}
                          </div>
                        </React.Fragment>
                      );
                    },
                  )}
                </List>
                <Divider className={classes.divider} />
              </>
            )}

            <Menu
              menuList={command.menuWeb}
            />


            {+command.totalPriceSansRemise !== 0 && (
              <>
                <Grid
                  container
                  justify="space-between"
                  alignItems="center"
                  style={{ padding: '8px 0' }}
                >
                  <Typography className="translate">
                    {'Sous-total de produits'}
                    <span>&bull;</span>{' '}
                  </Typography>
                  <Typography className="notranslate">
                    {`€${(
                      ((+command.totalPriceSansRemise || 0) / 100)
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 1,
                    })}`}
                  </Typography>
                </Grid>

              </>
            )}


            {command.commandType === "delivery" && +command.totalPrice !== 0 && (
              <>
                <Grid
                  container
                  justify="space-between"
                  alignItems="center"
                  style={{ padding: '8px 0' }}
                >
                  <Typography className="translate">
                    Frais de livraison
                  </Typography>
                  <Typography className="notranslate">{`€${(
                    command.deliveryPrice.amount / 100
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 1,
                  })}`}</Typography>
                </Grid>
              </>
            )}

            {(+command.remiseDelivery > 0 && command.commandType === "delivery") && <Grid
              container
              justify="space-between"
              alignItems="center"
              style={{ padding: '8px 0' }}
            >
              <Typography
                variant="h6"
                style={{ fontWeight: 300 }}
              >
                Remise sur le transport
              </Typography>
              <Typography
                variant="h6"
                style={{ fontWeight: 300 }}
              >{`€ ${(+command.remiseDelivery ).toLocaleString(undefined, {
                minimumFractionDigits: 1,
              })}`}</Typography>
            </Grid>}

            {(+command.remiseCode > 0) && <Grid
              container
              justify="space-between"
              alignItems="center"
              style={{ padding: '8px 0' }}
            >
              <Typography
                variant="h6"
                style={{ fontWeight: 300 }}
              >
                Remise code promo
              </Typography>
              <Typography
                variant="h6"
                style={{ fontWeight: 300 }}
              >{`€ ${(+command.remiseCode).toLocaleString(undefined, {
                minimumFractionDigits: 1,
              })}`}</Typography>
            </Grid>}

            {(+command.remiseTotal > 0) && <Grid
              container
              justify="space-between"
              alignItems="center"
              style={{ padding: '8px 0' }}
            >
              <Typography
                variant="h6"
                style={{ fontWeight: 300 }}
              >
                Remise
              </Typography>
              <Typography
                variant="h6"
                style={{ fontWeight: 300 }}
              >{`€ ${(+command.remiseTotal).toLocaleString(undefined, {
                minimumFractionDigits: 1,
              })}`}</Typography>
            </Grid>}


            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography className="translate">Total</Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.totalPrice}>
                  {PriceFormatter.format({
                    amount: command.totalPrice,
                    currency: 'eur',
                  })}
                </Typography>
              </Grid>
            </Grid>

            <Divider className={classes.divider} />

            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography className="translate">Type de commande</Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="h6"
                  component="p"
                  style={{ textTransform: 'uppercase' }}
                >
                  {command.commandType === 'delivery'
                    ? 'Livraison'
                    : command.commandType === 'on_site'
                      ? 'Sur place'
                      : 'À emporter'}
                </Typography>
              </Grid>
            </Grid>

            <Divider className={classes.divider} />

          </Grid>

          <Grid container justify="space-between" alignItems="center">
            <Typography
              variant="h6"
              style={{ color: 'black', fontWeight: 'bold' }}
            >
              Détails
            </Typography>
            <Typography
              variant="h6"
              style={{ color: 'black', fontWeight: 'bold' }}
            >
              {command.priceless ? 'Sans prix' : 'Avec prix'}
            </Typography>
          </Grid>

          <Divider className={classes.divider} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              columnGap: theme.spacing(2),
              rowGap: theme.spacing(1),
            }}
          >
            <Typography variant="h5" style={{ fontWeight: 'bold' }}>
              Nom et prénom
            </Typography>
            <Typography variant="h5">
              {
                command.relatedUser
                  ? `${command.relatedUser.name.first} ${command.relatedUser.name.last}`
                  : command.customer
                    ? command.customer.name
                    : 'Non spécifié'
              }
            </Typography>

            <Typography variant="h5" style={{ fontWeight: 'bold' }}>
              Téléphone
            </Typography>
            <Typography variant="h5">
              {command.relatedUser
                ? command.relatedUser.phoneNumber
                : command.customer
                  ? command.customer.phoneNumber
                  : 'Non spécifié'}
            </Typography>

            {command.commandType === 'delivery' && (
              <>
                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                  Adresse de livraison
                </Typography>
                <Typography variant="h5">
                  {command.shippingAddress}
                </Typography>

                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                  Appartement
                </Typography>
                <Typography variant="h5">{command.appartement}</Typography>

                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                  Étage
                </Typography>
                <Typography variant="h5">{command.etage}</Typography>

                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                  Type de livraison
                </Typography>
                <Typography variant="h5">
                  {command.optionLivraison === 'behind_the_door'
                    ? 'Derrière la porte'
                    : command.optionLivraison === 'on_the_door'
                      ? 'Devant la porte'
                      : "À l'extérieur"}
                </Typography>

                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                  Date et heure de livraison
                </Typography>
                <Typography variant="h5">
                  {DateFormatter.format(command.shippingTime, true)}
                </Typography>


                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                  Date de la commande
                </Typography>
                <Typography variant="h5">
                  {DateFormatter.format(command.updatedAt, true)}
                </Typography>

                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                  Paiement
                </Typography>
                <Typography variant="h5">
                  {`${command.paiementLivraison
                    ? 'À la livraison'
                    : 'Avant la livraison'
                    } - ${command.payed.status ? 'Payé' : 'Non payé'}`}
                </Typography>
              </>
            )}

            {command.commandType === 'takeaway' && (
              <>
                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                  Date de la commande
                </Typography>

                <Typography variant="h5">
                  {DateFormatter.format(command.updatedAt, true)}
                </Typography>

                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                  Date et heure de retrait
                </Typography>

                <Typography variant="h5">
                  {command.shipAsSoonAsPossible && command.commandType === 'takeaway' ? "Le plus tôt possible" : moment(command.shippingTime).format('Do MMMM YYYY, HH:mm')}
                </Typography>
              </>
            )}
          </div>

          <Divider className={classes.divider} />

          <Typography
            variant="h6"
            className="translate"
            gutterBottom
            style={{ textDecoration: 'underline' }}
          >
            Commentaire
          </Typography>

          <Typography style={{ color: !command.comment ? 'grey' : 'black' }}>
            {command.comment || 'Aucun commentaire'}
          </Typography>

        </Container>
      )}
    </Dialog>
  );
};

export default CommandDetailsDialog;