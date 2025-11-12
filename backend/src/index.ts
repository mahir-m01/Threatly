import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth/route.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// CORS configuration - allow requests from frontend
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use('/auth', authRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// For Render deployment
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`✅ CORS enabled for: ${FRONTEND_URL}`);
});

export default app;
