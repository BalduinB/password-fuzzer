import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
import * as schema from "./schema";
dotenv.config({
    debug: true,
    path: "../../.env",
});

const connection = await mysql.createConnection({
    user: process.env.DB_USER!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    password: process.env.DB_PASSWORD!,
    port: +process.env.DB_PORT!,
});

export const db = drizzle(connection, { schema, mode: "default" });
