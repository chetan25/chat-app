---
title: Simple Chat App with Deno, React and Observables.
excerpt: This is a simple chat app to practice Deno in backend and Observables with socket in the front end..
Tools: ['React', 'RXJS' ,'Typescript', 'Deno']
---

# Chat App

This is an effort to rewrite an old Chat application implementation with Deno in the backend and React and RxJS in the frontend. The Basic features that have been implemented so far are 

#### Backend 
- A Deno server that starts a web socket and listens for connection.
- Capability to maintain a local copy of all connected users connection and Rooms created. 
- By default all user would be joined to Public channel.
- Function to receive user messages and redirect to the connected user.


#### FrontEnd
- React font-end that let's user connect to server and send messages.
- Capability to add a user name and create rooms.
- Capability to Join a room and send/receive messages.


##### Things missing and could be added
- Capability to exit from room.
- Create private room or chat.
- Use RXJS Multiplexing to create separate socket channel for each room. This simulate opening several socket connections, while in reality maintaining only one. Refer this article for further reading `http://man.hubwiz.com/docset/RxJS.docset/Contents/Resources/Documents/api/webSocket/webSocket.html`


#### Local Development
- Starting Server - Navigate to `server` folder and
  > run `deno run --allow-net --allow-read mod.ts`
- Starting Frontend server - Navigate to `cleint` folder and 
  > run `npm start`  