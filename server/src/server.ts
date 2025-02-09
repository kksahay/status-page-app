import type postgres from "postgres";
import { App } from "./App";
import { DatabaseConnection } from "./configs/DatabaseConnection";
import { JobQueue } from "./services/JobQueue";

const db = new DatabaseConnection();
const jobQueue = new JobQueue();

export const sql: postgres.Sql = db.sql;

db.checkConnection()
  .then(() => {
    new App(3000);
    jobQueue.enqueue();
  })
  .catch((error) => {
    console.log(error);
  });
