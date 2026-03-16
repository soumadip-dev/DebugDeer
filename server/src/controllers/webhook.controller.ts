import type { Request, Response } from 'express';
import logger from '../utils/logger.utils';
import { reviewPullRequest } from '../lib/github';

//* Controller to handle GitHub webhook events
const handleGithubWebhook = async (req: Request, res: Response) => {
  try {
    const event = req.headers['x-github-event'];
    const body = req.body;

    logger.info(`Received GitHub event: ${event}`);

    // Handle ping event (GitHub sends this when webhook is first created)
    if (event === 'ping') {
      logger.info('Webhook ping received');
      return res.status(200).json({
        success: true,
        message: 'Pong',
        event: 'ping',
      });
    }

    // Handle pull request event
    if (event === 'pull_request') {
      logger.info('Pull request event received');
      const action = body.action;
      const prNumber = body.number;
      const repository = body.repository.full_name;

      const [owner, repoName] = repository.split('/');

      if (action === 'opened' || action === 'synchronize') {
        reviewPullRequest(owner, repoName, prNumber)
          .then(() => {
            logger.info(`Pull request reviewed for ${repository} #${prNumber}`);
          })
          .catch(error => {
            logger.error(`Error reviewing pull request for ${repository} #${prNumber}`, error);
          });
      }
    }

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
