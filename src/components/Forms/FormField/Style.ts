import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
        },
        button: {
            margin: theme.spacing(1),
        },
        dropzone: {
            width:"100%",
            height: "100%",
            margin: "1vh",
          },
    }),
);

export default useStyles;