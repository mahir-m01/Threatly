import express from 'express';
import { login, signup, getProfile } from './controller.ts';
import { validateSignIn, validateSignUp } from './middleware.ts';
import authenticateToken from '../middlewares/verifyToken.ts';

const router = express.Router();

// POST /api/auth/login
router.post('/login', validateSignIn, login);

// POST /api/auth/sign-up
router.post('/sign-up', validateSignUp, signup);

// GET /api/auth/profile (protected route)
router.get('/profile', authenticateToken, getProfile);

export default router;

