import {
    makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        width: '40px',
        marginRight: theme.spacing(2),
    },
    menu: {
        fontFamily: 'Cool Sans',
        fontSize: '1em',
    },
    advisor: {
        fontFamily: 'Golden Ranger',
        color: theme.palette.primary.main,
        fontSize: '1.5em',
    },
    root: {
        padding: theme.spacing(6, 10),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2, 4),
        },
    },
    product: {
        pointerEvents: 'none',
        backgroundSize: 'containe',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50%',
        transition: 'opacity 0.2s',
        transform: 'translateZ(0)',
        opacity: 1,
    },
    icon: {
        paddingRight: theme.spacing(1),
    },
    divider: {
        margin: theme.spacing(2, 0),
    },
    itemContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    itemName: {
        fontSize: 16,
        fontFamily: 'Work Sans',
    },
    itemPrice: {
        fontSize: 14,
        fontFamily: 'Work Sans',
    },
    itemTotalPrice: {
        fontSize: 16,
        fontWeight: 600,
        fontFamily: 'Work Sans',
        paddingLeft: theme.spacing(8),
    },
    stepper: {
        padding: 0,
        backgroundColor: 'transparent',
        [theme.breakpoints.down('md')]: {
            marginBottom: theme.spacing(2),
        },
    },
    chips: {
        margin: theme.spacing(1),
        '&.active': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.getContrastText(theme.palette.primary.main),
        },
    },
    shippingDate: {
        width: 200,
    },
}));

export default useStyles;