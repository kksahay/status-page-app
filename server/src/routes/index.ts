import type { Hono } from "hono";
import type { Env, BlankSchema } from "hono/types";
import serviceRoute from "./serviceRoute.js";
import userRoute from "./userRoute.js";
import maintenanceRoute from "./maintenanceRoute.js";
import statusRoute from "./statusRoute.js";

export interface RouterMW {
    path: string;
    router: Hono<Env, BlankSchema, "/">
}

export const routers: RouterMW[] = [
    { path: "/api/user", router: userRoute },
    { path: "/api/service", router: serviceRoute },
    { path: "/api/maintenance", router: maintenanceRoute },
    { path: "/api/status", router: statusRoute }
]
