import {
    WebSocket,
    isWebSocketCloseEvent,
  } from 'https://deno.land/std/ws/mod.ts'
  import { v4 } from 'https://deno.land/std/uuid/mod.ts'
  
  const users = new Map<string, WebSocket>();
  const rooms: Record<string, Record<string, WebSocket>> = {};
  
  function broadcast(message: string, senderId?: string): void {
    if (!message) return
    for (const user of users.values()) {
      user.send(senderId ? `[${senderId}]: ${message}` : message)
    }
  }

  function deleteUserFromRoom(userId: string) {
    for (const [roomId] of Object.entries(rooms)) {
      delete rooms[roomId][userId];
    }
  }

  function broadcastToChannel(message: string, senderId: string, channel: string, senderName?: string, messageType: string = "Message"): void {
    if (!message) return
    const channelUsers = rooms[channel];
    for (const [userId, socket] of Object.entries(channelUsers)) {
      socket.send(JSON.stringify({
        type: messageType,
        senderName: senderName,
        message: message,
        senderId: senderId,
        roomId: channel
      }));
    }
  }
  
  function updateUserRoom(newRooms: string[], userId: string) {
    for (const [roomId] of Object.entries(rooms)) {
      // add user
      if (newRooms.includes(roomId)) {
        if (!rooms[roomId][userId]) {
          const user =  users.get(userId);
          if (user) {
            rooms[roomId][userId] = user;
          }
        }
      } else {
        delete rooms[roomId][userId]; 
      }
    }
  }

  export async function chat(ws: WebSocket): Promise<void> {
    console.log('new connection', 'ws');
    const userId = v4.generate()
  
    // Register user connection
    users.set(userId, ws);
    // join user to the public group
    if (rooms['Public']) {
      rooms['Public'][userId] = ws;
    } else {
      rooms['Public'] = {};
      rooms['Public'][userId] = ws;
    }
    
    // send message to joined user
    const availableGroups = Object.keys(rooms);
    const user = users.get(userId);
    if (user) {
        user.send(JSON.stringify({
            type: 'UserInfo',
            message: 'Welcome User your Chat Info',
            userId: userId,
            rooms: availableGroups
        }));
    }

    // Wait for new messages
    for await (const event of ws) {
      const message = typeof event === 'string' ? event : ''
      // Unregister user conection
      if (!message && isWebSocketCloseEvent(event)) {
        console.log('disconnected');
        const { code, reason } = event;
        users.delete(userId)
        deleteUserFromRoom(userId);
        broadcastToChannel(`User ${userId} has left`, '1', 'Public', 'Server');
        break;
      } else {
        const messageData = JSON.parse(message);
        if (messageData.type === 'USER_JOINED') {
          console.log(message, userId, 'USER_JOINED');
          broadcastToChannel(`User ${messageData.name} has jooined......`, '1', 'Public', 'Server');
        } else if(messageData.type === 'CREATE_ROOM') {
          console.log(message, userId, 'CREATE_ROOM');
          // create new room and add the user who created that room 
          rooms[messageData.roomName] = {};
          const user = users.get(messageData.userId);
          if (user) {
            rooms[messageData.roomName][messageData.userId] = user;
          }
          const availableGroups = Object.keys(rooms);
          broadcast(JSON.stringify({
            type: 'RoomInfo',
            rooms: availableGroups
          }));
        } else if(messageData.type === 'UPDATE_USER_ROOMS') {
            // update user rooms, add/remove user from room
            updateUserRoom(messageData.rooms, messageData.userId);
        } else {
          console.log(message, userId, 'message');
            broadcastToChannel(
               messageData.message,
               messageData.userId,
               messageData.room,
               messageData.name
            );
        }
      }
    }
  }