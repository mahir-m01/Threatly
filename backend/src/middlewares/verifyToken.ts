import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JWTPayload {
  userId: string;
}

interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    req.user = decoded as JWTPayload;
    next();
  });
}

export default authenticateToken;