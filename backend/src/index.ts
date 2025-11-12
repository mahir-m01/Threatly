import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth/route.js';


dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use('/api/auth', authRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
