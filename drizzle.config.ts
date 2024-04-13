import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({
    debug: true,
    path: ".env",
});

export default {
    schema: "./src/evaluation/db/schema.ts",
    out: "./drizzle",
    driver: "mysql2",
    dbCredentials: {
        user: process.env.DB_USER!,
        database: process.env.DB_NAME!,
        host: process.env.DB_HOST!,
        password: process.env.DB_PASSWORD!,
        port: +process.env.DB_PORT!,
    },
} satisfies Config;
