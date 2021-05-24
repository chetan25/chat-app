import {
    ServerUserInfo, ServerMessage, SetName,
    Message, ChatMessages,
    AddRoom, MessageEvent
  } from '../types';

export const chatReducer = (state: ChatMessages, payload: MessageEvent) => {
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