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
    
    // Call Express app as a function with req and res
    // This is the standard way to use Express in serverless
    return cachedApp(req, res);
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
