import type { Request, Response } from 'express';
import logger from '../utils/logger.utils';

//* Controller to handle GitHub webhook events
const handleGithubWebhook = async (req: Request, res: Response) => {
  try {
    const event = req.headers['x-github-event'];
    const body = req.body;

    logger.info(`Received GitHub event: ${event}`);

    // Handle ping event (GitHub sends this when webhook is first created)
    if (event === 'ping') {
      logger.info('Webhook ping received - webhook is working');
      return res.status(200).json({
        success: true,
        message: 'Pong',
        event: 'ping',
      });
    }
    // TODO: Handle pull request event

    return res.status(200).json({
      success: true,
      message: 'Event processed',
      event,
    });
  } catch (error) {
    logger.error('Error handling GitHub webhook ❌', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { handleGithubWebhook };
