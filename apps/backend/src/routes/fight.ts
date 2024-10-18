import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { getRecentFights } from '../controllers/fightController';

const router = Router();

router.get('/recentActivity', authMiddleware, getRecentFights);

export const fightRouter = router;
