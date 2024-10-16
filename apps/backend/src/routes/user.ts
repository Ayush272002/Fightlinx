import { Router } from 'express';
import {
  createUser,
  getProfile,
  signin,
  updateUser,
} from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/signup', createUser);

router.post('/signin', signin);

router.post('/update', authMiddleware, updateUser);

router.get('/profile', authMiddleware, getProfile);

export const userRouter = router;
