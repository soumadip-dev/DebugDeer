import { Router } from 'express';
import { handleGithubWebhook } from '../controllers/webhook.controller';

const router = Router();

// GitHub will POST to this endpoint
router.post('/github', handleGithubWebhook);

export default router;
