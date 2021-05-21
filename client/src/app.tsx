import React, {useEffect, useState, useRef, useReducer} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
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
import { useStyles } from './app.styles';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import Typography from '@material-ui/core/Typography';
import { RoomDialogSelect } from './select-room';
import { CreateRoom } from './create-room';

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

type Messages = {
  userId: number;
  name?: string;
  message?: string;
  type: string;
  rooms?: string[];
  roomId?: string;
}

type ServerUserInfo = {
  userId: string;
  message?: string;
  type: 'UserInfo';
  rooms: string[];
}

type ServerRoomInfo = {
  type: 'RoomInfo';
  rooms: string[];
}

type ServerMessage = {
  senderId: string;
  senderName: string;
  message: 'Message';
  type: string;
  roomId: string;
}

type User = {
  userId: string;
  name?: string;
}

type Message = {
  message: string;
  senderName: string;
  senderId: string;
}

type ChatRoom = {
  rommdId?: string;
  roomName: string;
  messages: Message[]; 
}

type Rooms = Record<string, ChatRoom>;

type ChatMessages = {
  userName: string | null;
  userId: string | null;
  rooms: Rooms,
  availableRooms: string[];
};

type SetName = {name: string}

type AddRoom = {
  rooms: string[];
}

type ServerEvent = ServerUserInfo | ServerMessage | ServerRoomInfo | SetName | AddRoom;

type MessageType = 'UserInfo' | 'Message' | 'RoomInfo' | 'SET_NAME' | 'ADD_ROOM';

type MessageEvent = {
  type: MessageType
  event: ServerEvent;
}

const initialState = {
  userName: null,
  userId: null,
  rooms: {},
  availableRooms: []
};


const chatReducer = (state: ChatMessages, payload: MessageEvent) => {
  switch(payload.type) {
    case 'Message':
      // set the message data for the correct room
        const currentRooms = {...state.rooms};
        const roomId = (payload.event as ServerMessage).roomId;
        const message = (payload.event as ServerMessage).message;
        const senderName = (payload.event as ServerMessage).senderName;
        const senderId = (payload.event as ServerMessage).senderId;
        // find and update the message for correct room
        if (currentRooms[roomId]) {
            const updatedMessages:  Message[]  = [
              ...currentRooms[roomId].messages,
              {
                message: message,
                senderName: senderName,
                senderId: senderId
              }
            ];
            currentRooms[roomId].messages = updatedMessages;
        } else {
          const currentMessages = [{
            message,
            senderName,
            senderId
          }];
          currentRooms[roomId] = {
            roomName: roomId,
            messages: currentMessages
          }
        }
        console.log(currentRooms, 'currentRooms');
        return {
          ...state,
          rooms: currentRooms
        }
    case 'UserInfo': 
      return {
       ...state,
       userId: (payload.event as ServerUserInfo).userId,
       availableRooms: (payload.event as ServerUserInfo).rooms
      }
    case 'RoomInfo': 
     return {
      ...state,
      availableRooms: (payload.event as ServerUserInfo).rooms
     }
    case 'SET_NAME':
      return {
        ...state,
        userName: (payload.event as SetName).name
      }
    case 'ADD_ROOM':
      const roomsToAdd = (payload.event as AddRoom).rooms;
      const newRooms = {
        ...state.rooms
      };
      roomsToAdd.map(room => {
         if (!newRooms[room]) {
          newRooms[room] = {
            roomName: room,
            messages: [] 
          }
         }
      });
      return {
         ...state,
         rooms: newRooms
      }  
    default:
      return state;
  }
}


// let ws;
let socket$ : SocketType | null = null;


const App = (): JSX.Element => {
    const classes = useStyles();
    const [chatMessages, dispatch] = useReducer(chatReducer, initialState);
  
    const [openRoomsSelection, setOpenRoomsSelection] = useState(false);
    const [currentRooom, setCurrentRoom] = useState<string>('Public');
    const [selectedRoooms, setSelectedRooms] = useState([]);
    
    const [openCreateRoom, setOpenCreateRoom] = useState(false);

    const messageRef = useRef<HTMLTextAreaElement|null>(null);
    const nameRef = useRef<HTMLInputElement|null>(null);
   
    const { userId, userName, rooms, availableRooms } = chatMessages;

    const onReceiveMessage = (messageData: ServerEvent & {type: MessageType}) => {
       console.log(messageData, 'data-message');
       if (messageData.type === 'UserInfo') {
            dispatch({type: 'UserInfo', event: messageData});
        } else if(messageData.type === 'RoomInfo') {
          dispatch({type: 'RoomInfo', event: messageData});
        } else {
            dispatch({type: 'Message', event: messageData});
        }    
    }

    useEffect(() => {
        // if (ws) ws.close()
        // ws = new WebSocket(`ws://localhost:8002/ws`)
        // ws.addEventListener('message', onReceiveMessage);

        if (userName) {
          socket$ = getSocket();
          socket$?.next({
            name: userName,
            type: 'USER_JOINED'
          });
          socket$.subscribe(onReceiveMessage);
        }

        return () => {
        //  ws.removeEventListener('message', onReceiveMessage)
          if(socket$) {
            socket$?.complete();
          }
        }
      }, [getSocket, userName]);

    const sendMessage = () => {
        console.log('fired', currentRooom);
        socket$?.next({
              userId: userId,
              message: messageRef?.current?.value,
              name: userName,
              room: currentRooom
        });

        messageRef!.current!.value = '';
        // ws.send(JSON.stringify({
        //     userId: user.userId,
        //     message: messageRef.current.value,
        //     name: user.name
        // }));
    }

    const onNameSave = (event: React.ChangeEvent<{}>) => {
      event.preventDefault();
      if (nameRef?.current?.value && nameRef?.current?.value.length < 3) {
        return;
      }
      if (nameRef.current) {
        dispatch({
          type: 'SET_NAME',
          event: {
            name: nameRef.current.value
          }
        })
      }
    } 

    const getClassNane = (id: string) => {
        switch(id) {
          case '1':
            return classes.serverStyle;
          case userId: 
            return classes.currentUserStyle;
          default:
            return classes.normalMessageStyle;
        }
    }

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
      console.log('changed', newValue);
      setCurrentRoom(newValue);
    };

    const openRoomSelection = () => {
      setOpenRoomsSelection(true);
    }
    
    const onRoomSave = (rooms: string[]) => {
      console.log(rooms, 'newrooms');
      dispatch({
        type: 'ADD_ROOM',
        event: {
          rooms: rooms
        }
      })
      setOpenRoomsSelection(false);
    }

    const createRoom = (name: string) => {
      socket$?.next({
        type: 'CREATE_ROOM',
        roomName: name,
        userId
      });
      setOpenCreateRoom(false);
    }

    return (
        <>
            <CssBaseline />
            <div className={classes.root}>
                <Grid container spacing={3} className={classes.customGrid}>
                    <Grid item xs={12}>
                      <div className={classes.pageOptions}>
                        {
                          userName ? <><Chip
                              icon={<FaceIcon />}
                              label={userName}
                              color="primary"
                            />  
                            <Button onClick={openRoomSelection}>Select Room</Button>
                            <Button onClick={() => setOpenCreateRoom(true)}>Create Room</Button>
                            <RoomDialogSelect
                              onClose={() => setOpenRoomsSelection(false)}
                              open={openRoomsSelection}
                              onSave={onRoomSave}
                              availableRooms={availableRooms}
                              selectedRooms={Object.keys(rooms)}
                            />
                            <CreateRoom
                              open={openCreateRoom}
                              onClose={() => setOpenCreateRoom(false)}
                              onSave={createRoom}
                            />
                          </> : <form className={classes.root} noValidate autoComplete="off">
                            <TextField
                              required
                              id="standard-required"
                              label="Required"
                              inputRef={nameRef}
                            />
                              <IconButton 
                                className={classes.saveIcon}
                                color="primary"
                                aria-label="save display name"
                                component="span"
                                onClick={onNameSave}
                              >
                                <Save />
                              </IconButton>
                          </form>
                        }  
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div className={classes.chatTabs}>
                        {
                          userId ? <AppBar position="static" color="default">
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
                                  Object.keys(rooms).map((roomName, index) => {
                                    return <Tab value={roomName} label={roomName} key={index} {...a11yProps(roomName)} />
                                  })
                              }
                            </Tabs>
                          </AppBar> :<Typography variant="h4" gutterBottom>
                            Please Enter a name to start
                          </Typography>
                        } 
                        {
                            rooms ? Object.values(rooms).map(({messages, roomName}, index) => {
                              return <TabPanel value={currentRooom} index={roomName} key={index}>
                                <div className={classes.chatArea}>
                                      {
                                          messages.map((message, index) => {
                                            return <p key={index} className={getClassNane(message.senderId)}>
                                              {`${message.senderName}:  ${message.message}`}
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
                                disabled={!userName}
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