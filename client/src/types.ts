export type ServerUserInfo = {
    userId: string;
    message?: string;
    type: 'UserInfo';
    rooms: string[];
  }
  
export type ServerRoomInfo = {
    type: 'RoomInfo';
    rooms: string[];
  }
  
export type ServerMessage = {
    senderId: string;
    senderName: string;
    message: 'Message';
    type: string;
    roomId: string;
  }
  
  
export type Message = {
    message: string;
    senderName: string;
    senderId: string;
  }
  
export type ChatRoom = {
    rommdId?: string;
    roomName: string;
    messages: Message[]; 
  }
  
export type Rooms = Record<string, ChatRoom>;
  
export type ChatMessages = {
    userName: string | null;
    userId: string | null;
    rooms: Rooms,
    availableRooms: string[];
};
  
export type SetName = {name: string}
  
export type AddRoom = {
    rooms: string[];
}
  
export type ServerEvent = ServerUserInfo | ServerMessage | ServerRoomInfo | SetName | AddRoom;
  
export type MessageType = 'UserInfo' | 'Message' | 'RoomInfo' | 'SET_NAME' | 'ADD_ROOM';
  
export type MessageEvent = {
    type: MessageType
    event: ServerEvent;
}