import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import path from "path";

// Use Turso (cloud) when creds are provided, else fall back to local SQLite file
const isVercel = !!process.env.VERCEL;
const fallbackPath = isVercel ? "/tmp/frontier-local.db" : path.resolve((process as any).cwd?.() || ".", "frontier-local.db");
const dbUrl = process.env.DATABASE_URL || `file:${fallbackPath}`;
const authToken = process.env.DATABASE_AUTH_TOKEN;

let client;
let dbInstance;

try {
  client = createClient({
    url: dbUrl,
    ...(authToken ? { authToken } : {}),
  });
  dbInstance = drizzle(client, { schema });
} catch (error) {
  console.error("[Database] Initialization failed:", error);
  // Provide a dummy db instance to prevent total crash on import
  dbInstance = {} as any;
}

export const db = dbInstance;
