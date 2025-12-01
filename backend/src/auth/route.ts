import express from 'express';
import { signIn, signUp, getProfile, signOut } from './controller.js';
import { validateSignIn, validateSignUp } from './middleware.js';
import { googleOAuth } from './oauth.js';
import authenticateToken from '../middlewares/verifyToken.js';

const router = express.Router();

// POST /api/auth/sign-in
router.post('/sign-in', validateSignIn, signIn);

// POST /api/auth/sign-up
router.post('/sign-up', validateSignUp, signUp);

// POST /api/auth/sign-out
router.post('/sign-out', signOut);

// GET /api/auth/oauth/google/callback
router.get('/oauth/google/callback', googleOAuth);

// GET /api/auth/profile (protected route)
router.get('/profile', authenticateToken, getProfile);

export default router;
