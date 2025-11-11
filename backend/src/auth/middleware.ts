import { Request, Response, NextFunction } from 'express';

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

const validateSignUp = (req: SignUpRequest, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }
  next();
};

const validateSignIn = (req: SignInRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  next();
};

export { validateSignUp, validateSignIn };
