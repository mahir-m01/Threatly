import { Request, Response } from 'express';
import { createUser, signInUser, getUserById, updateUser } from './service.js';

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
    
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      path: '/'
    });

    // Old: Direct token response (kept for reference)
    // res.json({ success: true, data: result });
    
    res.json({ success: true, data: { user: result.user } });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};

const signUp = async (req: SignUpRequest, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const result = await createUser(name, email, password);
  
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      path: '/'
    });

    // Old: Direct token response (kept for reference)
    // res.status(201).json({ success: true, data: result });
    
    res.status(201).json({ success: true, data: { user: result.user } });
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

const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const { name, email } = req.body;
    
    if (!name && !email) {
      return res.status(400).json({ success: false, message: 'Name or email is required' });
    }
    
    const user = await updateUser(req.user.userId, name, email);
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const signOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/'
    });
    res.json({ success: true, message: 'Signed out successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export { signIn, signUp, getProfile, updateProfile, signOut };