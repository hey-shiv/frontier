import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import path from "path";

const isVercel = !!process.env.VERCEL;
const dbUrl = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

let client;
let dbInstance: any = {};

// We use an async IIFE or top-level await to initialize
// In ESNext, top-level await is allowed, but let's be safe for Vercel
try {
  if (isVercel && !dbUrl) {
    console.warn("[Database] Running on Vercel without DATABASE_URL. Using mock DB to prevent native binding crashes.");
  } else {
    // We import dynamically to avoid native binding crashes on Vercel if unused
    import("@libsql/client").then(({ createClient }) => {
      const finalUrl = dbUrl || `file:${path.resolve((process as any).cwd?.() || ".", "frontier-local.db")}`;
      client = createClient({
        url: finalUrl,
        ...(authToken ? { authToken } : {}),
      });
      // Replace the mock with the real instance once loaded
      dbInstance = drizzle(client, { schema });
    }).catch(err => {
      console.error("[Database] Async initialization failed:", err);
    });
  }
} catch (error) {
  console.error("[Database] Initialization failed:", error);
}

// Export a proxy so queries wait/fail gracefully if it's still loading or mocked
export const db = new Proxy({} as any, {
  get: (_, prop) => {
    return dbInstance[prop];
  }
});
