import { Request, Response } from 'express';
import { createUser, signInUser, getUserById } from './service.js';

interface SignUpRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

interface SignInRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

const signIn = async (req: SignInRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await signInUser(email, password);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};

const signup = async (req: SignUpRequest, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const result = await createUser(name, email, password);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const user = await getUserById(req.user.userId);
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export { signIn, signup, getProfile };