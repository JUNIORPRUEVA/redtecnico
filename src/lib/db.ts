import { Pool } from "pg";

const globalForPg = globalThis as typeof globalThis & {
  redtecnicoPool?: Pool;
};

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  globalForPg.redtecnicoPool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  return globalForPg.redtecnicoPool;
}
