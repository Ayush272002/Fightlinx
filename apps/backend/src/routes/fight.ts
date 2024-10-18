import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import {
  getRecentFights,
  initiateMatchmaking,
} from '../controllers/fightController';

const router = Router();

router.get('/recentActivity', authMiddleware, getRecentFights);

router.post('/matchmaking', initiateMatchmaking);

export const fightRouter = router;
