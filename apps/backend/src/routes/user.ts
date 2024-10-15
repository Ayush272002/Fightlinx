import { Router } from 'express';
// import { authMiddleware } from "../middlewares/authMiddleware";
import { createUser, signin } from '../controllers/userController';

const router = Router();

router.post('/signup', createUser);

router.post('/signin', signin);

// router.get("/", authMiddleware, getUser);

export const userRouter = router;
