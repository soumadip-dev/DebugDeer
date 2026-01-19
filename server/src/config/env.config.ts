import dotenv from 'dotenv';
dotenv.config({ quiet: true });

export type BunEnv = 'development' | 'production' | 'test';

export const env = {
  PORT: Number(process.env.PORT ?? 3000),
  BUN_ENV: process.env.BUN_ENV ?? 'development',
  FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ?? '',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ?? '',
};
