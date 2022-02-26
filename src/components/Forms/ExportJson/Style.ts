import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
        button: {
            margin: theme.spacing(1),
        },
    }),
);

export default useStyles;