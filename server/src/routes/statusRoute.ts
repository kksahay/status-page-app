import { Hono } from "hono";
import { statusController } from "../controllers/index.js";

const app =  new Hono();

app.get("/userId", (c) => statusController.getStatus(c));

export default app;