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

  function broadcastToChannel(message: string, senderId: string, channel: string, senderName?: string): void {
    if (!message) return
    const channelUsers = rooms[channel];
    for (const [userId, socket] of Object.entries(channelUsers)) {
      socket.send(JSON.stringify({
        type: 'Message',
        name: senderName,
        message: message,
        userId: senderId
    }));
      // user.send(senderId ? `[${senderId}]: ${message}` : message)
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

    broadcastToChannel(`User ${userId} has jooined`, '1', 'Public', 'Server');
    
    // send message to joined user
    const availableGroups = Object.keys(rooms);
    const user = users.get(userId);
    if (user) {
        user.send(JSON.stringify({
            type: 'Info',
            message: 'Welcome User your Chat Info',
            userId: userId,
            rooms: availableGroups
        }));
    }

    // Wait for new messages
    for await (const event of ws) {
      const message = typeof event === 'string' ? event : ''
      console.log(message, userId, 'incoming');
      // const messageData = JSON.parse(message);
      //   broadcast(message, userId);
      // Unregister user conection
      if (!message && isWebSocketCloseEvent(event)) {
        console.log('disconnected');
        const { code, reason } = event;
        console.log("ws:Close", code, reason);
        users.delete(userId)
        delete rooms['Public'][userId];
        broadcastToChannel(`User ${userId} has left`, '1', 'Public', 'Server');
        // broadcast(`> User with the id ${userId} is disconnected`)
        break;
      } else {
        const messageData = JSON.parse(message);
        broadcastToChannel(messageData.message, messageData.userId, messageData.room, messageData.name);
      }
    }
  }