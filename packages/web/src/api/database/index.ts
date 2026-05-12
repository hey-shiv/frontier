import * as schema from "./schema.js";

const isVercel = !!process.env.VERCEL;
const dbUrl = process.env.DATABASE_URL?.trim();
const authToken = process.env.DATABASE_AUTH_TOKEN?.trim();

let dbPromise: Promise<any | null> | undefined;
let warnedAboutMissingVercelDb = false;

export function hasDatabaseConfig(): boolean {
  return Boolean(dbUrl) || !isVercel;
}

export async function getDb(): Promise<any | null> {
  if (!hasDatabaseConfig()) {
    if (!warnedAboutMissingVercelDb) {
      console.warn("[Database] DATABASE_URL is not configured on Vercel. Saved projects are disabled.");
      warnedAboutMissingVercelDb = true;
    }
    return null;
  }

  dbPromise ??= createDatabase().catch((error) => {
    dbPromise = undefined;
    console.error("[Database] Initialization failed:", error);
    throw error;
  });

  return dbPromise;
}

async function createDatabase() {
  const url = dbUrl || getLocalDatabaseUrl();
  const connection = {
    url,
    ...(authToken ? { authToken } : {}),
  };

  if (shouldUseHttpDriver(url)) {
    const { drizzle } = await import("drizzle-orm/libsql/http");
    return drizzle({ connection, schema });
  }

  const [{ createClient }, { drizzle }] = await Promise.all([
    import("@libsql/client/node"),
    import("drizzle-orm/libsql/node"),
  ]);

  return drizzle(createClient(connection), { schema });
}

function shouldUseHttpDriver(url: string): boolean {
  return isVercel || /^(libsql|https?):\/\//i.test(url);
}

function getLocalDatabaseUrl(): string {
  let cwd = ".";
  if (typeof process !== "undefined" && "cwd" in process) {
    const p = process as unknown as { cwd?: () => string };
    if (typeof p.cwd === "function") {
      cwd = p.cwd();
    }
  }
  return `file:${cwd.replace(/\\/g, "/")}/frontier-local.db`;
}

export const db = new Proxy({} as any, {
  get: () => {
    throw new Error("Database access is asynchronous. Use getDb() instead.");
  },
});
