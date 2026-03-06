import { Router } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getConnectedRepositories,
  disconnectRepository,
  disconnectAllRepositories,
} from '../controllers/settings.controller.ts';

const router = Router();

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/repositories', getConnectedRepositories);
router.delete('/repositories/:repositoryId', disconnectRepository);
router.delete('/repositories', disconnectAllRepositories);

export default router;
