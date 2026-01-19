import type { Request, Response } from 'express';
import logger from '../utils/logger.utils';

export const healthCheck = (req: Request, res: Response) => {
  logger.info('Health check request received 📨');
  res.status(200).json({
    message: 'API is running smoothly ✅',
    success: true,
  });
};
