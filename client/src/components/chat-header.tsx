import React, {Dispatch, useRef, useState} from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Save from '@material-ui/icons/Save';
import { useStyles } from '../app.styles';
import Chip from '@material-ui/core/Chip';
import { RoomDialogSelect } from '../select-room';
import { MessageEvent, Rooms } from '../types';
import FaceIcon from '@material-ui/icons/Face';
import { CreateRoom } from '../create-room';
import TextField from '@material-ui/core/TextField';

interface HeaderProps {
 dispatch: Dispatch<MessageEvent>;
 userName: string | null;
 dispatchCreateRoom: (name: string) => void;
 availableRooms: string[];
 rooms: Rooms;
 dispatchAddRoom: (rooms: string[]) => void;
}

const ChatHeader = ({
  dispatch,
  userName,
  availableRooms,
  rooms,
  dispatchCreateRoom,
  dispatchAddRoom
}: HeaderProps) => {
    const classes = useStyles();
    const nameRef = useRef<HTMLInputElement|null>(null);
    const [openRoomsSelection, setOpenRoomsSelection] = useState(false);
    const [openCreateRoom, setOpenCreateRoom] = useState(false);

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
        });
        dispatchAddRoom(rooms);
        setOpenRoomsSelection(false);
    }
  
    const createRoom = (name: string) => {
        dispatchCreateRoom(name);
        // socket$?.next({
        //   type: 'CREATE_ROOM',
        //   roomName: name,
        //   userId
        // });
        setOpenCreateRoom(false);
    }

    return (
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
    );
}

export default ChatHeader;