import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { userRouter } from './routes/user';
import { fightRouter } from './routes/fight';
dotenv.config();

const app = express();
app.use(
  cors({
    origin: 'https://fightlinx.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

app.use('/api/v1/user', userRouter);
app.use('/api/v1/fight', fightRouter);

//global catch
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.json({
    msg: 'Sorry something is up with our server',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
