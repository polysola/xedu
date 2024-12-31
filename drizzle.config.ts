import "dotenv/config";
import type { Config } from "drizzle-kit";
import { parse } from "pg-connection-string";

// Phân tích DATABASE_URL
const dbConfig = parse(process.env.DATABASE_URL!);

const config: Config = {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: dbConfig.host!,
    port: Number(dbConfig.port) || 5432,
    user: dbConfig.user!,
    password: dbConfig.password!,
    database: dbConfig.database!,
    ssl: { rejectUnauthorized: false },
  },
};

export default config;
