import { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || '';

interface GoogleTokenResponse {
  access_token: string;
}

interface GoogleUserInfo {
  email: string;
  name: string;
}

const googleOAuth = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      return res.redirect(`${FRONTEND_URL}/sign-in?error=true`);
    }

    // Exchange code for tokens
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenResponse.data as GoogleTokenResponse;

    // Get user info from Google
    const userInfoResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const { email, name } = userInfoResponse.data as GoogleUserInfo;

    // Find or create user
    let user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.users.create({
        data: { email, name, password: '' },
      });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '2d' });

    // Create cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 2 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.redirect(`${FRONTEND_URL}/dashboard`);
  } catch (error: any) {
    console.error('Google OAuth error:', error.message);
    res.redirect(`${FRONTEND_URL}/sign-in?error=true`);
  }
};

export { googleOAuth };
