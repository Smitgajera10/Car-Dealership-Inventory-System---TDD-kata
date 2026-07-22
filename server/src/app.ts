import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes';
import { errorMiddleware } from './middleware/error.middleware';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use(errorMiddleware);
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
