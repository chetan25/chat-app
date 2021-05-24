import React, {useEffect, useState, useReducer} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { getSocket, SocketType } from './services/chat';
import { useStyles } from './app.styles';
import ChatHeader from './components/chat-header';
import { ServerEvent, MessageType } from './types';
import ChatFooter from './components/chat-footer';
import ChatBody from './components/chat-body';
import { chatReducer } from './services/chat-reducer';

const initialState = {
  userName: null,
  userId: null,
  rooms: {},
  availableRooms: []
};

// let ws;
let socket$ : SocketType | null = null;

const App = (): JSX.Element => {
    const classes = useStyles();
    const [chatMessages, dispatch] = useReducer(chatReducer, initialState);
    const [currentRooom, setCurrentRoom] = useState<string>('Public');
    const { userId, userName, rooms, availableRooms } = chatMessages;

    /**
     * This method accepts all incoming message and based on the  
     * message type fires the dispatch action.
     * This uses Webscoket as a single channel
     */
    const onReceiveMessage = (messageData: ServerEvent & {type: MessageType}) => {
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

    const sendMessage = (message: string) => {
        socket$?.next({
              userId: userId,
              message: message,
              name: userName,
              room: currentRooom
        });
        // ws.send(JSON.stringify({
        //     userId: user.userId,
        //     message: messageRef.current.value,
        //     name: user.name
        // }));
    }

    const dispatchCreateRoom = (name: string) => {
      socket$?.next({
        type: 'CREATE_ROOM',
        roomName: name,
        userId
      });
    }

    const dispatchAddRoom = (rooms: string[]) => {
      socket$?.next({
        type: 'UPDATE_USER_ROOMS',
        rooms: rooms,
        userId,
        name: userName
      });
    };

    return (
        <>
            <CssBaseline />
            <div className={classes.root}>
                <Grid container spacing={3} className={classes.customGrid}>
                    <Grid item xs={12}>
                      <ChatHeader
                          dispatch={dispatch}
                          userName={userName}
                          availableRooms={availableRooms}
                          rooms={rooms}
                          dispatchCreateRoom={dispatchCreateRoom}
                          dispatchAddRoom={dispatchAddRoom}
                      />
                    </Grid>
                    <Grid item xs={12}>
                       <ChatBody
                         rooms={rooms}
                         userId={userId}
                         currentRooom={currentRooom}
                         setCurrentRoom={setCurrentRoom}
                        />
                    </Grid>
                    <Grid item xs={12}>
                      <ChatFooter sendMessage={sendMessage} userName={userName}/>
                    </Grid>
                </Grid>    
            </div>       
        </>
    );
}

export default App;