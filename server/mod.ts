// import { listenAndServe, ServerRequest } from 'https://deno.land/std/http/server.ts';
// import { acceptWebSocket, acceptable } from 'https://deno.land/std/ws/mod.ts'
// Third party dependencies
// import { oakCors } from "https://deno.land/x/cors/mod.ts";
// import { Application } from "https://deno.land/x/oak@v6.3.2/mod.ts";

import { chat } from './chat.ts';
import { serve } from "https://deno.land/std@0.96.0/http/server.ts";
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
  WebSocket,
} from "https://deno.land/std@0.96.0/ws/mod.ts";

// setting up deno server
// const app = new Application();
// app.use(oakCors());

const PORT = 8002;

// listenAndServe({ port: PORT }, async (req: ServerRequest) => {
//   if (req.method === 'GET' && req.url === '/') {
//     req.respond({
//       status: 200,
//       headers: new Headers({
//         'content-type': 'text/html',
//       }),
//       body: await Deno.open('./build/index.html'),
//     })
//   }

//   // WebSockets Chat
//   if (req.method === 'GET' && req.url === '/ws') {
//     if (acceptable(req)) {
//       acceptWebSocket({
//         conn: req.conn,
//         bufReader: req.r,
//         bufWriter: req.w,
//         headers: req.headers,
//       }).then(chat)
//     }
//   }
// })


// async function handleWs(sock: WebSocket) {
//   console.log("socket connected!");
  
//   try {
//     for await (const ev of sock) {
//       if (typeof ev === "string") {
//         // text message.
//         console.log("ws:Text", ev);
//         await sock.send(ev);
//       } else if (ev instanceof Uint8Array) {
//         // binary message.
//         console.log("ws:Binary", ev);
//       } else if (isWebSocketPingEvent(ev)) {
//         const [, body] = ev;
//         // ping.
//         console.log("ws:Ping", body);
//       } else if (isWebSocketCloseEvent(ev)) {
//         // close.
//         const { code, reason } = ev;
//         console.log("ws:Close", code, reason);
//       }
//     }
//   } catch (err) {
//     console.error(`failed to receive frame: ${err}`);

//     if (!sock.isClosed) {
//       await sock.close(1000).catch(console.error);
//     }
//   }
// }

if (import.meta.main) {
  /** websocket echo server */
  const port = Deno.args[0] || PORT;
  console.log(`websocket server is running on :${port}`);
  for await (const req of serve(`:${port}`)) {
    const { conn, r: bufReader, w: bufWriter, headers } = req;
    acceptWebSocket({
      conn,
      bufReader,
      bufWriter,
      headers,
    })
      .then(chat)
      .catch(async (err) => {
        console.error(`failed to accept websocket: ${err}`);
        await req.respond({ status: 400 });
      });
  }
}



// ctx contains current state and has req,res, application, state
// app.use(async (ctx) => {
//     const filePath = ctx.request.url.pathname;
//     const fileWhiteList = [
//         '/index.html',
//         '/javascripts/script.js',
//         '/stylesheets/style.css',
//         '/images/favicon.png',
//         '/videos/space.mp4'
//     ];
//     if (fileWhiteList.includes(filePath)) {
//         await send(ctx, filePath, {
//             root: `${Deno.cwd()}/public`
//         });
//     } 
// });