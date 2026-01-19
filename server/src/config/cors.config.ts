import type { CorsOptions } from 'cors';
import cors from 'cors';
import { env } from './env.config';
import logger from '../utils/logger.utils';

//* Function that creates and returns a configured CORS middleware instance
const configureCors = (): ReturnType<typeof cors> => {
  const options: CorsOptions = {
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow: boolean) => void
    ) => {
      const allowedOrigins: string[] = [env.FRONTEND_URL, 'https://yourcustomdomain.com'];

      if (!origin || allowedOrigins.includes(origin)) {
        logger.info(`CORS allowed for origin: ${origin || 'Unknown'} ✅`);
        callback(null, true);
      } else {
        logger.warn(`CORS blocked for origin: ${origin} 🚫`);
        callback(new Error('Not allowed by CORS ❌'), false);
      }
    },

    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Version'],
    exposedHeaders: ['X-Total-Count', 'Content-Range'],
    credentials: true,
    preflightContinue: false,
    maxAge: 600,
    optionsSuccessStatus: 204,
  };

  logger.info('CORS middleware configured successfully ✅');
  return cors(options);
};

export default configureCors;
