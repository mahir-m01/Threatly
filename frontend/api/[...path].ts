import type { VercelRequest, VercelResponse } from '@vercel/node';

// Dynamic import for ESM backend
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // @ts-ignore - ESM import
    const { default: app } = await import('../backend/dist/index.js');
    return app(req, res);
  } catch (error) {
    console.error('Error loading backend:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
