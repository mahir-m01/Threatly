import express from 'express';
import { login, signup, getProfile } from './controller.js';
import { validateSignIn, validateSignUp } from './middleware.js';
import authenticateToken from '../middlewares/verifyToken.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', validateSignIn, login);

// POST /api/auth/sign-up
router.post('/sign-up', validateSignUp, signup);

// GET /api/auth/profile (protected route)
router.get('/profile', authenticateToken, getProfile);

export default router;

