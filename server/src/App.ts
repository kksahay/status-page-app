import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { routers } from "./routes/index.js";

export class App {
    private readonly app;
    
    constructor(private readonly PORT: number) {
        this.app = new Hono();
        this.app.use(prettyJSON());
        this.app.use(cors());
        this.app.use(compress());
        this.app.notFound((c) => {
            return c.text("StatusPage Backend", 404);
        });
        this.routes();
    }

    private routes() {
        routers.forEach((router) => {
            this.app.route(router.path, router.router);
        });
    }

    public listen() {
        serve({
            fetch: this.app.fetch,
            port: this.PORT,
        });
        console.log(`Server is running on Port: ${this.PORT}`);
    }
}