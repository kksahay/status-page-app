import { serve, type ServerType } from "@hono/node-server";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { routers } from "./routes/index";
import type { Server as HTTPServer } from "node:http";
import { SocketConnection } from "./configs/SocketConnection";

export class App {
    private readonly app;
    private readonly httpServer: ServerType;

    constructor(private readonly PORT: number) {
        this.app = new Hono();
        this.httpServer = serve({
            fetch: this.app.fetch,
            port: this.PORT,
        });
        new SocketConnection(this.httpServer as HTTPServer);
        this.middlewares();
        this.routes();
        console.log(`Server is running on Port: ${this.PORT}`);
    }

    private middlewares() {
        this.app.use(prettyJSON());
        this.app.use(cors());
        this.app.use(compress());
        this.app.notFound((c) => c.text("StatusPage Backend", 404));
    }

    private routes() {
        routers.forEach((router) => {
            this.app.route(router.path, router.router);
        });
    }
}