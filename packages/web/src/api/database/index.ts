import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import path from "path";

// Use Turso (cloud) when creds are provided, else fall back to local SQLite file
const dbUrl = process.env.DATABASE_URL || `file:${path.resolve((process as any).cwd(), "frontier-local.db")}`;
const authToken = process.env.DATABASE_AUTH_TOKEN;

const client = createClient({
  url: dbUrl,
  ...(authToken ? { authToken } : {}),
});

export const db = drizzle(client, { schema });
