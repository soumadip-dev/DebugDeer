import type { Express, NextFunction, Request, Response } from 'express';

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFound } from './middlewares/error.middleware';
import configureCors from './config/cors.config';

import logger from './utils/logger.utils';
import healthRoutes from './routes/health.routes';

const app: Express = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(configureCors());
app.use(express.json()); // parse json request to body
app.use(express.urlencoded({ extended: true })); // parse form data (like html form)

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Received ${req.method} request to ${req.url} 📨`);
  logger.info(`Request body: ${JSON.stringify(req.body)}`);
  next();
});

// Home route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'DebugDeer server is running 🦌',
    success: true,
  });
});

app.use('/api/health', healthRoutes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
