import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';


export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%',
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    margin: {
      margin: theme.spacing(1),
    },
    chatOptions: {
      padding: theme.spacing(2),
      border: '1px solid black',
      display: 'grid',
      gridTemplateColumns: '2fr 1fr'
    },
    chatArea: {
      padding: theme.spacing(1),
      // border: '1px solid black',
      height: '100%'
    },
    chatTabs: {
      padding: theme.spacing(1),
      border: '1px solid black',
      height: '100%',
      maxHeight: '55vh',
      overflowY: 'auto'
    },
    customGrid: {
        margin: '0px',
        marginTop: '2rem',
        display: 'grid',
        height: '90vh',
        gridTemplateRows: 'min-content 2fr min-content',
        justifyContent: 'center',
        width: '100%'
    },
    pageOptions: {
        padding: theme.spacing(1),
        border: '1px solid black',
        height: '100%'
    },
    customInput: {
        width: '80ch !important'
    },
    button: {
        margin: theme.spacing(1),
    },
    fullWidth: {
      maxWidth: '100%'
    },
    serverStyle: {
      font: 'bold',
      color: 'green'
    },
    currentUserStyle: {
      color: 'red',
      textAlign: 'end'
    },
    normalMessageStyle: {
    },
    saveIcon: {
      paddingTop: '1.5rem'
    },
    userIcon: {
      padding: theme.spacing(1)
    },
  }),
);
