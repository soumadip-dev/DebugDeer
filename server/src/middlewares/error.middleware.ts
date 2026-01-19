import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env.config.js';

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`Route not found: ${req.originalUrl} ❌`);
  next(error);
}

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  const response = {
    message: err.message,
    success: false,
    errors: env.BUN_ENV === 'production' ? undefined : [err.stack || ''],
  };

  res.json(response);
}
