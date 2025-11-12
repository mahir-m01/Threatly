import type { VercelRequest, VercelResponse } from '@vercel/node';

// Cache the app to avoid reloading on every request
let cachedApp: any = null;

// Dynamic import for ESM backend
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Load or use cached Express app
    if (!cachedApp) {
      // @ts-ignore - ESM import
      const { default: app } = await import('../../backend/dist/index.js');
      cachedApp = app;
    }
    
    // Express apps in newer versions need to be called with a callback
    // This ensures the request is fully processed before returning
    await new Promise<void>((resolve, reject) => {
      cachedApp(req, res, (err: any) => {
        if (err) {
          console.error('Express error:', err);
          reject(err);
        } else {
          resolve();
        }
      });
      
      // Also resolve when response finishes
      res.on('finish', () => resolve());
    });
  } catch (error) {
    console.error('Error loading backend:', error);
    if (!res.headersSent) {
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
