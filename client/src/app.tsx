import React, {useEffect, useState, useRef} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { getSocket, SocketType } from './services/chat';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    chatOptions: {
      padding: theme.spacing(2),
      border: '1px solid black',
      display: 'grid',
      gridTemplateColumns: '2fr 1fr'
    },
    chatArea: {
      padding: theme.spacing(1),
      border: '1px solid black',
      height: '70vh'
    },
    customGrid: {
        marginTop: '2rem',
        display: 'flex',
        justifyContent: 'center'
    },
    pageOptions: {
        padding: theme.spacing(2),
        textAlign: 'center',
        border: '1px solid black'
    },
    customInput: {
        width: '100ch !important'
    },
    button: {
        margin: theme.spacing(1),
    },
  }),
);

// let ws;
let socket$ : SocketType | null = null;

type Messages = {
   userId: number;
   name?: string;
   message?: string;
   type: string;
}

type User = {
    userId: number;
    name?: string;
}

const App = (): JSX.Element => {
    const classes = useStyles();
    const [messages, setMessages] = useState<Messages[]>([]);
    const [user, setUser] = useState<User|null>(null);
    const messageRef = useRef('');

    const onReceiveMessage = (messageData: Messages) => {
        console.log('message', messageData);
        // const data = JSON.parse(messageData.data);
        // console.log(data, 'data');
        if (messageData.type === 'Info') {
            setUser({name: '', userId: messageData.userId});
        } else {
            console.log(messageData, 'data-message');
            setMessages((prevState: Messages[]) => {
                return [
                    ...prevState,
                    {
                        userId: messageData.userId,
                        name: messageData.name,
                        message: messageData.message,
                        type: messageData.type
                    }
                ]
            });
        }    
    }

    useEffect(() => {
        // if (ws) ws.close()
        // ws = new WebSocket(`ws://localhost:8002/ws`)
        // ws.addEventListener('message', onReceiveMessage);

        socket$ = getSocket();
        socket$.subscribe(onReceiveMessage);

        return () => {
        //   ws.removeEventListener('message', onReceiveMessage)
          if(socket$) {
            socket$?.complete();
          }
        }
      }, []);

    const sendMessage = () => {
        // ws.send(JSON.stringify({
        //     userId: user.userId,
        //     message: messageRef.current.value,
        //     name: user.name
        // }));
    }

    return (
        <>
            <CssBaseline />
            <div className={classes.root}>
                <Grid container spacing={3} className={classes.customGrid}>
                    <Grid item xs={10}>
                      <div className={classes.pageOptions}>Options</div>
                    </Grid>
                    <Grid item xs={10}>
                      <div className={classes.chatArea}>
                            {
                                messages.map((message, index) => {
                                  return <p key={index}>{`${message.name} ---- ${message.message}`}</p>
                                })
                            }
                      </div>
                    </Grid>
                    <Grid item xs={10}>
                        <div className={classes.chatOptions}>
                           <TextField
                                id="outlined-multiline-static"
                                label="Multiline"
                                multiline
                                rows={4}
                                defaultValue="Default Value"
                                variant="outlined"
                                className={classes.customInput}
                                inputRef={messageRef}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={sendMessage}
                            >
                                Send
                            </Button>
                        </div>
                    </Grid>
                </Grid>    
            </div>       
        </>
    );
}

export default App;