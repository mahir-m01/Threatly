# About Threatly

Small developers, startups, and open-source maintainers often lack accessible tools to evaluate their application's security posture. Tools like OWASP ZAP or Nuclei are powerful but complex to configure, while dependency vulnerabilities and weak configurations often go unnoticed.  

**Threatly** aims to simplify this process through a full-stack dashboard that integrates multiple free security APIs and tools, allowing users to test their web apps or GitHub repositories and view consolidated reports in one place.

## 📁 Project Structure

This is a monorepo containing two separate applications:

- **`frontend/`** - Next.js application (deployed on Vercel)
- **`backend/`** - Express.js REST API (deployed on Render)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

The backend runs on `http://localhost:4000`

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Configure your .env.local file
npm run dev
```

The frontend runs on `http://localhost:3000`

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to:
- Frontend: Vercel
- Backend: Render

## 🔧 Tech Stack

### Frontend
- Next.js 16
- React 19
- TailwindCSS 4
- TypeScript

### Backend
- Express.js
- Prisma (PostgreSQL)
- JWT Authentication
- TypeScript

## 📝 Environment Variables

See `.env.example` files in both `frontend/` and `backend/` directories for required configuration.

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Complete deployment instructions
- [Frontend README](./frontend/README.md) - Frontend-specific documentation (if exists)
- [Backend README](./backend/README.md) - Backend-specific documentation (if exists)