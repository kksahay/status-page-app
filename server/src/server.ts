import type postgres from "postgres";
import { App } from "./App.js";
import { DatabaseConnection } from "./configs/DatabaseConnection.js";
import { SocketConnection } from "./configs/SocketConnection.js";
import type { Server as HTTPServer } from "node:http";
import { JobQueue } from "./services/JobQueue.js";

const db = new DatabaseConnection();
const messageQueue = new JobQueue();

export const sql: postgres.Sql = db.sql;

db.checkConnection()
  .then(() => {
    const app = new App(3000);
    const socket = new SocketConnection(app.httpServer as HTTPServer);
    messageQueue.enqueue();
  })
  .catch((error) => {
    console.log(error);
  });
