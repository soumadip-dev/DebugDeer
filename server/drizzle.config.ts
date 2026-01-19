import { defineConfig } from 'drizzle-kit';
import { env } from './src/config/env.config';

export default defineConfig({
  schema: ['./src/db/schema.ts', './src/db/auth-schema.ts'],
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
