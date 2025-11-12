import { VercelRequest, VercelResponse } from '@vercel/node';

// Dynamic import to handle ESM
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { default: app } = await import('../../backend/dist/index.js');
  return app(req, res);
}
