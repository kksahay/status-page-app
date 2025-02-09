import postgres from "postgres";

export class DatabaseConnection {
    public sql: postgres.Sql;
    constructor() {
        this.sql = postgres(process.env.DB_URI! || "postgres://myuser:mypassword@localhost:5432/mydatabase", {
            port: 5432,
            ssl: process.env.DB_URI ? true : false
        });
    }
    async checkConnection() {
        try {
            await this.sql`SELECT 1`;
            console.log("Database connected successfully");
            return true;
        } catch (error) {
            console.error("Database connection failed", error);
            return false;
        }
    }
}