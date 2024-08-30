import type { Config } from "drizzle-kit";
require("dotenv").config();

export default {
    schema: "./api/db/schema.js",
    out: "./api/migrations",
    dialect: "sqlite",
    driver: "turso",
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
    },
} satisfies Config;
