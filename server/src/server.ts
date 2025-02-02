import type postgres from "postgres";
import { App } from "./App.js";
import { DatabaseConnection } from "./configs/DatabaseConnection.js";

const db = new DatabaseConnection();
const app = new App(3000);

export const sql: postgres.Sql = db.sql;

db.checkConnection()
  .then(() => {
    app.listen();
  })
  .catch((error) => {
    console.log(error);
  })