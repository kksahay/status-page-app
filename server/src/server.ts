import type postgres from "postgres";
import { App } from "./App.js";
import { DatabaseConnection } from "./configs/DatabaseConnection.js";
import { JobQueue } from "./services/JobQueue.js";

const db = new DatabaseConnection();
const jobQueue = new JobQueue();

export const sql: postgres.Sql = db.sql;

db.checkConnection()
  .then(() => {
    new App(parseInt(process.env.PORT!));
    jobQueue.enqueue();
  })
  .catch((error) => {
    console.log(error);
  });
