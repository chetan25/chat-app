import { webSocket,  WebSocketSubject  } from "rxjs/webSocket";

let socket$: SocketType  | null = null;

export function getSocket(): SocketType {
    if (socket$) {
        return socket$;
    }
    socket$ = webSocket(`ws://localhost:8002/ws`);
    
    return socket$;
}

export type SocketType = WebSocketSubject<any>;