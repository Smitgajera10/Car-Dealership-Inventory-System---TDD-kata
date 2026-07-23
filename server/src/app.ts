import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes';
import vehicleRouter from './routes/vehicle.routes';
import purchaseRouter from './routes/purchase.routes';
import { errorMiddleware } from './middleware/error.middleware';
export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/vehicles', vehicleRouter);
app.use('/api/purchases', purchaseRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(errorMiddleware);
