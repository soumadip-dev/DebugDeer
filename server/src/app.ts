import type { Express, NextFunction, Request, Response } from 'express';

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFound } from './middlewares/error.middleware';
import configureCors from './config/cors.config';
import { auth } from './lib/auth.ts';

import logger from './utils/logger.utils';
import healthRoutes from './routes/health.routes';
import dashboardRoutes from './routes/dashboard.routes';
import repositoryRoutes from './routes/repository.routes';
import webhookRoutes from './routes/webhook.routes';
import settingsRoutes from './routes/settings.routes';

import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';

const app: Express = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(configureCors());

// Route handler for Better Auth endpoints
app.all('/api/auth/*splat', toNodeHandler(auth));

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

// Get current session
app.get('/api/me', async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

app.use('/api/health', healthRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/repo', repositoryRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
