import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth/route.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// CORS configuration - allow all origins in production for Vercel
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle OPTIONS requests explicitly
app.options('*', cors());

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

// Export for Vercel serverless - wrap Express app in a handler
export default app;
