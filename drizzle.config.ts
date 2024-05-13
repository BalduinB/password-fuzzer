import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
    schema: "./src/evaluation/db/schema.ts",
    out: "./drizzle",
    driver: "mysql2",
    dialect: "mysql",
    dbCredentials: {
        user: process.env.DB_USER!,
        database: process.env.DB_NAME!,
        host: process.env.DB_HOST!,
        password: process.env.DB_PASSWORD!,
        port: +process.env.DB_PORT!,
    },
});
