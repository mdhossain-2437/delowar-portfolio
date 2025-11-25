import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// Configure Neon for serverless
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Set this environment variable in Vercel project settings.",
  );
}

// Connection pooling for serverless
// Reuse connections across function invocations
let cachedPool: Pool | null = null;
let cachedDb: ReturnType<typeof drizzle> | null = null;

export function getDbConnection() {
  // Return cached connection if available
  if (cachedDb && cachedPool) {
    return { db: cachedDb, pool: cachedPool };
  }

  // Create new connection pool
  const pool = new Pool({ 
    connectionString,
    max: 1, // Limit connections in serverless
  });
  
  const db = drizzle(pool);

  // Cache for reuse
  cachedPool = pool;
  cachedDb = db;

  return { db, pool };
}

// Helper to close connection (optional cleanup)
export async function closeDbConnection() {
  if (cachedPool) {
    await cachedPool.end();
    cachedPool = null;
    cachedDb = null;
  }
}
