import type { VercelRequest, VercelResponse } from '@vercel/node';

// Dynamic import for ESM backend
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // @ts-ignore - ESM import
    const { default: app } = await import('../../backend/dist/index.js');
    
    // Express app needs to be invoked as middleware
    // Pass the request and response to Express
    await new Promise((resolve, reject) => {
      app(req, res);
      res.on('finish', resolve);
      res.on('error', reject);
    });
  } catch (error) {
    console.error('Error loading backend:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
