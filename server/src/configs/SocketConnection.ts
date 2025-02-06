import type { Server as HTTPServer } from "node:http";
import { Server } from "socket.io";

export class SocketConnection {
    public static io: Server;

    constructor(private readonly httpServer: HTTPServer) {
        SocketConnection.io = new Server(this.httpServer, {
            cors: {
                origin: "*",
            }
        });
        this.init();
        console.log("Websocket initialized")
    }

    private init() {
        SocketConnection.io.on("connection", (socket) => {
            console.log(`User connected: ${socket.id}`);
            socket.on("disconnect", () => {
                console.log(`User disconnected: ${socket.id}`);
            });
        });
    }

    public static getIO(): Server {
        if (!SocketConnection.io) {
            throw new Error("Socket.io instance has not been initialized.");
        }
        return SocketConnection.io;
    }
}
