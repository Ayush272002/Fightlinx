import { Router } from 'express';
import {
  createUser,
  getProfile,
  getUpcomingMatches,
  quickStats,
  signin,
  updateUser,
} from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/signup', createUser);

router.post('/signin', signin);

router.post('/update', authMiddleware, updateUser);

router.get('/profile', authMiddleware, getProfile);

router.get('/quickStats', authMiddleware, quickStats);

router.get('/getUpcomingMatches', authMiddleware, getUpcomingMatches);

export const userRouter = router;
