import { Router } from 'express';
import { getDashboardStats, getMonthlyActivity } from '../controllers/dashboard.controller';

const router = Router();

router.get('/stats', getDashboardStats);
router.get('/activity', getMonthlyActivity);

export default router;
