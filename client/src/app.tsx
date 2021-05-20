import React, {useEffect, useState, useRef} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { getSocket, SocketType } from './services/chat';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Save from '@material-ui/icons/Save';


interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: string) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}


const useStyles = makeStyles((theme: Theme) =>
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
    }
  }),
);

// let ws;
let socket$ : SocketType | null = null;

type Messages = {
   userId: number;
   name?: string;
   message?: string;
   type: string;
   rooms?: string[];
}

type User = {
    userId: number;
    name?: string;
}

const App = (): JSX.Element => {
    const classes = useStyles();
    const [messages, setMessages] = useState<Messages[]>([]);
    const [rooms, setRooms] = useState<string[]>([]);
    const [user, setUser] = useState<User|null>(null);
    const messageRef = useRef<HTMLTextAreaElement|null>(null);
    const [currentRooom, setCurrentRoom] = useState('Public');

    const onReceiveMessage = (messageData: Messages) => {
        if (messageData.type === 'Info') {
            // console.log('message', messageData);
            setUser({name: 'Test', userId: messageData.userId});
            setRooms(messageData.rooms || []);
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
        console.log('fired');
         socket$?.next({
              userId: user?.userId,
              message: messageRef?.current?.value,
              name: user?.name,
              room: currentRooom
          });
        // ws.send(JSON.stringify({
        //     userId: user.userId,
        //     message: messageRef.current.value,
        //     name: user.name
        // }));
    }

    const getClassNane = (id: number) => {
        switch(String(id)) {
          case '1':
            return classes.serverStyle;
          case String(user?.userId): 
            return classes.currentUserStyle;
          default:
            return classes.normalMessageStyle;
        }
    }

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
      setCurrentRoom(newValue);
    };

    return (
        <>
            <CssBaseline />
            <div className={classes.root}>
                <Grid container spacing={3} className={classes.customGrid}>
                    <Grid item xs={12}>
                      <div className={classes.pageOptions}>
                        <form className={classes.root} noValidate autoComplete="off">
                          <TextField id="standard-basic" label="Display Name" />
                            <IconButton className={classes.saveIcon} color="primary" aria-label="save display name" component="span">
                              <Save />
                            </IconButton>
                        </form>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div className={classes.chatTabs}>
                        {
                          user ?  <AppBar position="static" color="default">
                            <Tabs
                              value={currentRooom}
                              onChange={handleChange}
                              indicatorColor="primary"
                              textColor="primary"
                              variant="scrollable"
                              scrollButtons="auto"
                              aria-label="romms avialbale"
                            >
                              {
                                  rooms.map((roomName, index) => {
                                    return <Tab value={roomName} label={roomName} key={index} {...a11yProps(roomName)} />
                                  })
                              }
                            </Tabs>
                          </AppBar> : null
                        } 
                        {
                            messages ? rooms.map((roomName, index) => {
                              return <TabPanel value={roomName} index={roomName} key={index}>
                                <div className={classes.chatArea}>
                                      {
                                          messages.map((message, index) => {
                                            return <p key={index} className={getClassNane(message.userId)}>
                                              {`${message.userId}:  ${message.message}`}
                                            </p>
                                          })
                                      }
                                </div>
                              </TabPanel>
                            }) : null
                        }
                      </div>
                    </Grid>
                    <Grid item xs={12}>
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