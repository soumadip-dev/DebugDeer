import { Router } from 'express';
import { fetchRepositories, connectRepository } from '../controllers/repository.controller';

const router = Router();

// Fetch user's GitHub repositories with connection status
router.get('/', fetchRepositories);

// Connect a GitHub repository and create webhook
router.post('/connect', connectRepository);

export default router;
