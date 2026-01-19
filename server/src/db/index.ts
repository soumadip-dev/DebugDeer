import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { env } from '../config/env.config';
import logger from '../utils/logger.utils';

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined 🚨');
}

// initialize the connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

pool.on('connect', () => {
  logger.info('Database connected successfully ✅');
});

pool.on('error', err => {
  logger.error('Database connection error ❌', err);
});

export const db = drizzle({ client: pool, schema });

/*
NOTE::::::::
👀 What is a Connection Pool?
A connection pool is a cache of database connections that are kept open and reused.

🤷♂️ Why use it?
🔴 Opening/closing connections is slow. Instead of creating a new connection for each request, we reuse existing ones.
🔴 Databases limit concurrent connections. A pool manages a fixed number of connections and shares them across requests.
*/
