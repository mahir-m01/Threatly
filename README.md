# Threatly

A modern security scanning platform that helps developers evaluate their web application's security posture using industry-standard tools like HTTP Observatory and SSL Labs.

## Overview

Threatly provides a comprehensive dashboard for scanning websites, tracking security scores over time, and managing multiple projects. Built for developers who need accessible security testing without complex configuration.

## Features

**Authentication & User Management**
- Email/password authentication with JWT
- Google OAuth 2.0 integration
- Secure session management with HttpOnly cookies
- User profile management

**Project Management**
- Create and manage multiple projects
- Project status tracking (active/inactive)
- Full CRUD operations with authorization
- Cascade deletion for data integrity

**Security Scanning**
- HTTP Observatory integration for web security analysis
- SSL Labs integration for TLS/SSL configuration testing
- Automatic retry logic with exponential backoff
- Detailed vulnerability reports and grades
- Scan history tracking with timestamps

**Analytics & Reporting**
- 15-day security score trends
- Interactive charts for HTTP and SSL metrics
- Project-specific analytics
- Historical data visualization

**Advanced Features**
- Server-side pagination for large datasets
- Case-insensitive project name search
- Multi-filter support (project, scan type, date range)
- Debounced search inputs
- Real-time scan execution
- External report linking

## Tech Stack

**Frontend**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- Recharts for data visualization
- Axios for HTTP requests

**Backend**
- Node.js with Express.js
- TypeScript
- Prisma ORM
- PostgreSQL database
- JWT authentication
- bcrypt for password hashing

**External APIs**
- Mozilla HTTP Observatory API
- Qualys SSL Labs API
- Google OAuth 2.0

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- npm or yarn

### Installation

**1. Clone Repository**
```bash
git clone https://github.com/mahir-m01/Threatly.git
cd Threatly
```

**2. Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database URL and secrets
npx prisma migrate deploy
npm run build
npm start
```

**3. Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your backend URL
npm run build
npm start
```

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/threatly"
JWT_SECRET="your-secret-key-min-32-chars"
PORT=4000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="optional"
GOOGLE_CLIENT_SECRET="optional"
```

**Frontend (.env)**
```env
NEXT_PUBLIC_BACKEND_URL="http://localhost:4000"
```

## API Endpoints

### Authentication
- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - Login user
- `POST /api/auth/sign-out` - Logout user
- `GET /api/auth/oauth/google/callback` - Google OAuth callback

### User
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update user profile

### Projects
- `GET /api/projects` - List all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `PUT /api/projects/:id/status` - Update project status

### Scans
- `POST /api/projects/:id/scan/mozilla` - Run HTTP Observatory scan
- `POST /api/projects/:id/scan/ssl` - Run SSL Labs scan
- `GET /api/projects/:id/scan/mozilla/latest` - Get latest HTTP scan
- `GET /api/projects/:id/scan/ssl/latest` - Get latest SSL scan
- `GET /api/projects/scans` - Get all scans with filters/pagination
- `DELETE /api/projects/scans` - Delete specific scan

### Analytics
- `GET /api/projects/:id/analytics` - Get analytics


## Database Schema

**Users**
- Authentication and profile information
- One-to-many relationship with Projects

**Projects**
- Website/application details
- Status tracking (active/inactive)
- One-to-many relationships with scans

**HttpObservatoryScan**
- HTTP security scan results
- Grades, scores, test results
- Linked to Projects

**SSLLabsScan**
- SSL/TLS scan results
- Protocol support, vulnerabilities, certificates
- Linked to Projects

## Development

**Backend Development Server**
```bash
cd backend
npm run dev
```

**Frontend Development Server**
```bash
cd frontend
npm run dev
```

**Database Migrations**
```bash
cd backend
npx prisma migrate dev --name migration_name
```

## Deployment

### Backend (Render/Railway/Fly.io)
1. Set environment variables
2. Build: `npm run build`
3. Start: `npm start`
4. Post-deploy: `npm run migrate:deploy`

### Frontend (Vercel/Netlify)
1. Set `NEXT_PUBLIC_BACKEND_URL`
2. Deploy from main branch
3. Automatic builds on push


## Project Structure

```
Threatly/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── auth/
│       ├── user/
│       ├── projects/
│       │   ├── controllers/
│       │   └── services/
│       ├── middlewares/
│       └── lib/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (auth)/
│       │   └── dashboard/
│       └── components/
│           ├── dashboard/
│           ├── landing-page/
│           └── ui/
```

## Key Features Detail

**Scan History Table**
- Server-side pagination (10/20/30/50 per page)
- Real-time project name search
- Filter by project and scan type
- Delete individual scans
- Links to detailed external reports

**Analytics Dashboard**
- Interactive line charts
- Historical trends
- HTTP score and SSL grade tracking
- Project switcher dropdown

**Security Features**
- Password hashing with bcrypt
- JWT tokens with HttpOnly cookies
- CORS protection
- User ownership validation
- Protected API routes

