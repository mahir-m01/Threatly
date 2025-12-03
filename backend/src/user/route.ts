import express from 'express';
import { getProfile, updateProfile } from '../auth/controller.js';
import authenticateToken from '../middlewares/verifyToken.js';

const router = express.Router();

// GET /api/user/profile 
router.get('/profile', authenticateToken, getProfile);

// PATCH /api/user/profile 
router.patch('/profile', authenticateToken, updateProfile);

export default router;
