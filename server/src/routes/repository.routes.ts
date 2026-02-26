import { Router } from 'express';
import { fetchRepositories } from '../controllers/repository.controller';

const router = Router();

router.get('/repositories', fetchRepositories);

export default router;
