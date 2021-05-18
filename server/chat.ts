import {
    WebSocket,
    isWebSocketCloseEvent,
  } from 'https://deno.land/std/ws/mod.ts'
  import { v4 } from 'https://deno.land/std/uuid/mod.ts'
  
  const users = new Map<string, WebSocket>()
  
  function broadcast(message: string, senderId?: string): void {
    if (!message) return
    for (const user of users.values()) {
      user.send(senderId ? `[${senderId}]: ${message}` : message)
    }
  }
  
  export async function chat(ws: WebSocket): Promise<void> {
    console.log('new connection', 'ws');
    const userId = v4.generate()
  
    // Register user connection
    users.set(userId, ws)
    broadcast(JSON.stringify({
        type: 'Message',
        name: 'Server',
        message: 'Welcome User',
        userId: '1'
    }));
    const user = users.get(userId);
    if (user) {
        user.send(JSON.stringify({
            type: 'Info',
            message: 'Welcome User your Chat Info',
            userId: userId
        }));
    }

    // Wait for new messages
    for await (const event of ws) {
      const message = typeof event === 'string' ? event : ''
      console.log(message, userId, 'incoming');
      // const messageData = JSON.parse(message);
    //   broadcast(message, userId);
       broadcast(message);
      // Unregister user conection
      if (!message && isWebSocketCloseEvent(event)) {
        users.delete(userId)
        broadcast(`> User with the id ${userId} is disconnected`)
        break;
      }
    }
  }