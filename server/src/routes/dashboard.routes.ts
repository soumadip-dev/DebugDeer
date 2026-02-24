import { Router } from 'express';
import {
  getContributionGraph,
  getDashboardStats,
  getMonthlyActivity,
} from '../controllers/dashboard.controller';

const router = Router();

router.get('/stats', getDashboardStats);
router.get('/activity', getMonthlyActivity);
router.get('/contribution-graph', getContributionGraph);

export default router;
