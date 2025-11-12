# Vercel Deployment Configuration

## Environment Variables Required in Vercel

Set these in your Vercel Project Settings → Environment Variables:

### Backend (API Routes)
- `DATABASE_URL` - Your PostgreSQL connection string from Render
- `JWT_SECRET` - Your JWT secret key for token generation
- `FRONTEND_URL` - Your Vercel deployment URL (e.g., https://your-app.vercel.app)
- `NODE_ENV` - Set to `production`

### Frontend
- `NEXT_PUBLIC_BACKEND_URL` - Leave empty (will use same domain /api routes)
- `NODE_ENV` - Set to `production`

## Deployment Steps

1. Connect your GitHub repository to Vercel
2. Set Root Directory to: `. ` (keep it empty/root)
3. Framework Preset: Other
4. Build Command: `npm run build`
5. Output Directory: `frontend/.next`
6. Install Command: `npm install`
7. Add all environment variables listed above
8. Deploy!

## How It Works

- Frontend is deployed as a Next.js app from `/frontend`
- Backend Express app runs as serverless functions in `/api`
- All API calls go to `/api/*` which routes to your Express backend
- PostgreSQL database hosted on Render (no changes needed)
- Prisma Client is generated during build time
