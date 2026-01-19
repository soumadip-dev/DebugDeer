import dotenv from 'dotenv';
dotenv.config({ quiet: true });

export type BunEnv = 'development' | 'production' | 'test';

export const env = {
  PORT: Number(process.env.PORT ?? 3000),
  BUN_ENV: process.env.BUN_ENV ?? 'development',
  FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY ?? '',
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? '',
};
