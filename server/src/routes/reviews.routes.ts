import { Router } from 'express';
import { getReviews } from '../controllers/reviews.controller';

const router = Router();

router.get('/', getReviews);

export default router;
