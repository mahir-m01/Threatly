# Threatly - Complete Technical Documentation

## Table of Contents
1. [Application Overview](#application-overview)
2. [Database Schema](#database-schema)
3. [Backend API Routes](#backend-api-routes)
4. [Frontend-Backend Integration](#frontend-backend-integration)
5. [Application Flow](#application-flow)
6. [Service Architecture](#service-architecture)
7. [Features List](#features-list)

---

## Application Overview

Threatly is a full-stack security scanning platform that allows users to scan websites for security vulnerabilities using HTTP Observatory and SSL Labs APIs. The application provides user authentication, project management, scan execution, analytics, and comprehensive reporting.

**Tech Stack:**
- Frontend: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui
- Backend: Express.js, TypeScript, Prisma ORM
- Database: PostgreSQL
- Authentication: JWT with HttpOnly cookies, Google OAuth
- External APIs: Mozilla HTTP Observatory, Qualys SSL Labs

---

## Database Schema

### Users Table
```prisma
model Users {
  id        String    @id @default(cuid())
  name      String
  email     String    @unique
  password  String
  role      String    @default("user")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  projects  Projects[]
}
```

**Fields:**
- `id`: Unique user identifier (CUID)
- `name`: User's full name
- `email`: Unique email address for authentication
- `password`: Bcrypt hashed password
- `role`: User role (default: "user")
- `createdAt`: Account creation timestamp
- `updatedAt`: Last profile update timestamp
- `projects`: One-to-many relation with Projects

### Projects Table
```prisma
model Projects {
  id          String                  @id @default(cuid())
  name        String
  link        String
  description String
  status      String                  @default("active")
  userId      String
  user        Users                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime                @default(now())
  updatedAt   DateTime                @updatedAt
  httpScans   HttpObservatoryScan[]
  sslScans    SSLLabsScan[]
}
```

**Fields:**
- `id`: Unique project identifier
- `name`: Project display name
- `link`: Website URL to scan
- `description`: Project description/notes
- `status`: "active" or "inactive"
- `userId`: Foreign key to Users table
- `user`: Many-to-one relation with Users
- `httpScans`: One-to-many relation with HTTP scans
- `sslScans`: One-to-many relation with SSL scans

### HttpObservatoryScan Table
```prisma
model HttpObservatoryScan {
  id           String   @id @default(cuid())
  projectId    String
  project      Projects @relation(fields: [projectId], references: [id], onDelete: Cascade)
  grade        String
  score        Int
  testsPassed  Int
  testsFailed  Int
  detailsUrl   String?
  scannedAt    DateTime @default(now())
  
  @@index([projectId, scannedAt])
}
```

**Fields:**
- `id`: Unique scan identifier
- `projectId`: Foreign key to Projects
- `grade`: Security grade (A+, A, B, C, D, F)
- `score`: Numeric score (0-100+)
- `testsPassed`: Number of security tests passed
- `testsFailed`: Number of security tests failed
- `detailsUrl`: URL to full Observatory report
- `scannedAt`: Scan execution timestamp

### SSLLabsScan Table
```prisma
model SSLLabsScan {
  id            String   @id @default(cuid())
  projectId     String
  project       Projects @relation(fields: [projectId], references: [id], onDelete: Cascade)
  grade         String
  hasWarnings   Boolean
  supportsTLS13 Boolean
  supportsTLS12 Boolean
  supportsTLS11 Boolean
  supportsTLS10 Boolean
  certIssuer    String?
  certExpires   DateTime?
  vulnHeartbleed Boolean
  vulnPoodle     Boolean
  vulnFreak      Boolean
  vulnLogjam     Boolean
  vulnBeast      Boolean
  hstsEnabled   Boolean
  detailsUrl    String?
  scannedAt     DateTime @default(now())
  
  @@index([projectId, scannedAt])
}
```

**Fields:**
- `id`: Unique scan identifier
- `projectId`: Foreign key to Projects
- `grade`: SSL grade (A+, A, B, C, D, E, F, T)
- `hasWarnings`: Boolean flag for SSL warnings
- `supportsTLS13/12/11/10`: TLS protocol support flags
- `certIssuer`: Certificate authority name
- `certExpires`: Certificate expiration date
- `vulnHeartbleed/Poodle/Freak/Logjam/Beast`: Vulnerability flags
- `hstsEnabled`: HSTS policy enabled flag
- `detailsUrl`: URL to full SSL Labs report
- `scannedAt`: Scan execution timestamp

---

## Backend API Routes

### Authentication Routes (`/api/auth`)

#### POST /api/auth/sign-up
**Purpose:** Register a new user account  
**Controller:** `signUp` in `auth/controller.ts`  
**Service:** `createUser` in `auth/service.ts`  
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cuid",
      "email": "john@example.com",
      "name": "John Doe"
    }
  }
}
```
**Side Effects:** Sets HttpOnly JWT cookie, creates user in database

#### POST /api/auth/sign-in
**Purpose:** Authenticate existing user  
**Controller:** `signIn` in `auth/controller.ts`  
**Service:** `signInUser` in `auth/service.ts`  
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cuid",
      "email": "john@example.com",
      "name": "John Doe"
    }
  }
}
```
**Side Effects:** Sets HttpOnly JWT cookie

#### POST /api/auth/sign-out
**Purpose:** Logout user and clear session  
**Controller:** `signOut` in `auth/controller.ts`  
**Authentication:** None required  
**Response:**
```json
{
  "success": true,
  "message": "Signed out successfully"
}
```
**Side Effects:** Clears JWT cookie

#### GET /api/user/profile
**Purpose:** Get authenticated user profile  
**Controller:** `getProfile` in `auth/controller.ts`  
**Service:** `getUserById` in `auth/service.ts`  
**Authentication:** Required (JWT)  
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cuid",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### PATCH /api/user/profile
**Purpose:** Update user profile (name/email)  
**Controller:** `updateProfile` in `auth/controller.ts`  
**Service:** `updateUser` in `auth/service.ts`  
**Authentication:** Required (JWT)  
**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cuid",
    "email": "john.smith@example.com",
    "name": "John Smith"
  }
}
```
**Validation:** Checks email uniqueness before update

#### GET /api/auth/oauth/google/callback
**Purpose:** Google OAuth callback handler  
**Controller:** `googleOAuth` in `auth/oauth.ts`  
**Authentication:** None (OAuth flow)  
**Query Parameters:** `code` (from Google)  
**Side Effects:** Creates user if new, sets JWT cookie, redirects to dashboard

---

### Project Routes (`/api/projects`)

#### GET /api/projects
**Purpose:** List all projects for authenticated user  
**Controller:** `getAllProjects` in `projects/controllers/project.controller.ts`  
**Service:** `getAllProjects` in `projects/services/service.ts`  
**Authentication:** Required (JWT)  
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cuid",
      "name": "My Website",
      "link": "https://example.com",
      "description": "Production website",
      "status": "active",
      "createdAt": "2025-12-03T00:00:00.000Z",
      "updatedAt": "2025-12-03T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/projects
**Purpose:** Create new project  
**Controller:** `createProject` in `projects/controllers/project.controller.ts`  
**Service:** `createProject` in `projects/services/service.ts`  
**Authentication:** Required (JWT)  
**Request Body:**
```json
{
  "name": "My Website",
  "link": "https://example.com",
  "description": "Production website"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cuid",
    "name": "My Website",
    "link": "https://example.com",
    "description": "Production website",
    "status": "active"
  }
}
```

#### GET /api/projects/:id
**Purpose:** Get single project details  
**Controller:** `getProject` in `projects/controllers/project.controller.ts`  
**Service:** `getProjectById` in `projects/services/service.ts`  
**Authentication:** Required (JWT)  
**Authorization:** Must own the project  
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cuid",
    "name": "My Website",
    "link": "https://example.com",
    "description": "Production website",
    "status": "active"
  }
}
```

#### PUT /api/projects/:id
**Purpose:** Update project details  
**Controller:** `updateProject` in `projects/controllers/project.controller.ts`  
**Service:** `updateProject` in `projects/services/service.ts`  
**Authentication:** Required (JWT)  
**Authorization:** Must own the project  
**Request Body:**
```json
{
  "name": "Updated Name",
  "link": "https://newurl.com",
  "description": "New description",
  "status": "inactive"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cuid",
    "name": "Updated Name",
    "link": "https://newurl.com",
    "description": "New description",
    "status": "inactive"
  }
}
```

#### DELETE /api/projects/:id
**Purpose:** Delete project and all associated scans  
**Controller:** `deleteProject` in `projects/controllers/project.controller.ts`  
**Service:** `deleteProject` in `projects/services/service.ts`  
**Authentication:** Required (JWT)  
**Authorization:** Must own the project  
**Response:**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```
**Side Effects:** Cascades delete to all HttpObservatoryScan and SSLLabsScan records

#### PUT /api/projects/:id/status
**Purpose:** Update project status (active/inactive)  
**Controller:** `updateStatus` in `projects/controllers/project.controller.ts`  
**Service:** `updateProject` in `projects/services/service.ts`  
**Authentication:** Required (JWT)  
**Request Body:**
```json
{
  "status": "inactive"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cuid",
    "status": "inactive"
  }
}
```
**Validation:** Status must be "active" or "inactive"

---

### Scan Routes (`/api/projects`)

#### POST /api/projects/:id/scan/mozilla
**Purpose:** Execute HTTP Observatory security scan  
**Controller:** `analyzeMozilla` in `projects/controllers/scan.controller.ts`  
**Services:** 
- `scanHttpObservatory` in `projects/services/observatory.service.ts`
- `storeHttpObservatoryScan` in `projects/services/observatory.service.ts`
**Authentication:** Required (JWT)  
**Authorization:** Must own the project  
**External API:** `https://observatory-api.mdn.mozilla.net/api/v2/scan`  
**Response:**
```json
{
  "http": {
    "success": true,
    "data": {
      "grade": "A+",
      "score": 105,
      "testsPassed": 10,
      "testsFailed": 0,
      "detailsUrl": "https://developer.mozilla.org/...",
      "scannedAt": "2025-12-03T00:00:00.000Z"
    }
  }
}
```
**Retry Logic:** 5 attempts with exponential backoff (1s, 2s, 4s, 8s, 16s)  
**Timeout:** 45 seconds

#### POST /api/projects/:id/scan/ssl
**Purpose:** Execute SSL Labs TLS security scan  
**Controller:** `analyzeSSL` in `projects/controllers/scan.controller.ts`  
**Services:**
- `scanSSLLabs` in `projects/services/ssllabs.service.ts`
- `storeSSLLabsScan` in `projects/services/ssllabs.service.ts`
**Authentication:** Required (JWT)  
**Authorization:** Must own the project  
**External API:** `https://api.ssllabs.com/api/v3/analyze`  
**Response:**
```json
{
  "success": true,
  "data": {
    "grade": "A",
    "hasWarnings": false,
    "supportsTLS13": true,
    "supportsTLS12": true,
    "certIssuer": "Let's Encrypt",
    "certExpires": "2026-03-01T00:00:00.000Z",
    "vulnHeartbleed": false,
    "hstsEnabled": true,
    "detailsUrl": "https://www.ssllabs.com/ssltest/..."
  }
}
```
**Retry Logic:** 5 attempts with exponential backoff  
**Timeout:** 60 seconds  
**Special Behavior:** Polls API until scan completes (max 5 minutes)

#### GET /api/projects/:id/scan/mozilla/latest
**Purpose:** Get most recent HTTP Observatory scan for project  
**Controller:** `getLatestMozilla` in `projects/controllers/scan.controller.ts`  
**Service:** `getLatestHttpScan` in `projects/services/observatory.service.ts`  
**Authentication:** Required (JWT)  
**Response:**
```json
{
  "success": true,
  "data": {
    "grade": "A+",
    "score": 105,
    "testsPassed": 10,
    "testsFailed": 0,
    "detailsUrl": "https://developer.mozilla.org/...",
    "scannedAt": "2025-12-03T00:00:00.000Z"
  }
}
```

#### GET /api/projects/:id/scan/ssl/latest
**Purpose:** Get most recent SSL Labs scan for project  
**Controller:** `getLatestSSL` in `projects/controllers/scan.controller.ts`  
**Service:** `getLatestSSLScan` in `projects/services/ssllabs.service.ts`  
**Authentication:** Required (JWT)  
**Response:**
```json
{
  "success": true,
  "data": {
    "grade": "A",
    "hasWarnings": false,
    "supportsTLS13": true,
    "certExpires": "2026-03-01T00:00:00.000Z",
    "scannedAt": "2025-12-03T00:00:00.000Z"
  }
}
```

#### GET /api/projects/scans
**Purpose:** Get all scans with filtering, search, and pagination  
**Controller:** `getScans` in `projects/controllers/scans.controller.ts`  
**Service:** `getAllScans` in `projects/services/scans.service.ts`  
**Authentication:** Required (JWT)  
**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `projectId` (string, optional)
- `scanType` ("http" | "ssl" | "all", default: "all")
- `search` (string, optional - searches project names)
- `startDate` (ISO date, optional)
- `endDate` (ISO date, optional)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "scan-cuid",
      "type": "HTTP Observatory",
      "projectId": "project-cuid",
      "projectName": "My Website",
      "projectStatus": "active",
      "score": 105,
      "grade": "A+",
      "scannedAt": "2025-12-03T00:00:00.000Z",
      "detailsUrl": "https://..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```
**Search:** Case-insensitive substring match on project name  
**Filtering:** All filters applied at database level  
**Sorting:** Descending by scannedAt

#### DELETE /api/projects/scans
**Purpose:** Delete a specific scan by ID  
**Controller:** `deleteScan` in `projects/controllers/scans.controller.ts`  
**Authentication:** Required (JWT)  
**Authorization:** Must own the project containing the scan  
**Request Body:**
```json
{
  "scanId": "scan-cuid",
  "scanType": "http"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Scan deleted successfully"
}
```
**Validation:** scanType must be "http" or "ssl"

---

### Analytics Routes (`/api/projects`)

#### GET /api/projects/:id/analytics
**Purpose:** Get 15-day security score trends for a project  
**Controller:** `getAnalytics` in `projects/controllers/analytics.controller.ts`  
**Service:** `getProjectAnalytics` in `projects/services/analytics.service.ts`  
**Authentication:** Required (JWT)  
**Authorization:** Must own the project  
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-11-18",
      "httpScore": 105,
      "sslGrade": "A"
    },
    {
      "date": "2025-11-19",
      "httpScore": 100,
      "sslGrade": "A"
    }
  ]
}
```
**Data:** Returns last 15 days of scan data, one entry per day (most recent scan)

---

## Frontend-Backend Integration

### Authentication Flow

**Sign Up:**
```typescript
// File: frontend/src/app/(auth)/sign-up/page.tsx
const response = await axios.post(
  `${apiUrl}/api/auth/sign-up`,
  { name, email, password },
  { withCredentials: true }
)
```

**Sign In:**
```typescript
// File: frontend/src/app/(auth)/sign-in/page.tsx
const response = await axios.post(
  `${apiUrl}/api/auth/sign-in`,
  { email, password },
  { withCredentials: true }
)
```

**Sign Out:**
```typescript
// File: frontend/src/components/dashboard/nav-user.tsx
const response = await axios.post(
  `${apiUrl}/api/auth/sign-out`,
  {},
  { withCredentials: true }
)
```

**Get Profile:**
```typescript
// File: frontend/src/app/dashboard/layout.tsx
const response = await axios.get(
  `${apiUrl}/api/user/profile`,
  { withCredentials: true }
)
```

**Update Profile:**
```typescript
// File: frontend/src/app/dashboard/account/page.tsx
const response = await axios.patch(
  `${apiUrl}/api/user/profile`,
  { name, email },
  { withCredentials: true }
)
```

### Project Management Flow

**List Projects:**
```typescript
// File: frontend/src/components/dashboard/project-grade-cards.tsx
// File: frontend/src/app/dashboard/projects/page.tsx
const response = await axios.get(
  `${apiUrl}/api/projects`,
  { withCredentials: true }
)
```

**Create Project:**
```typescript
// File: frontend/src/app/dashboard/quick-create/page.tsx
const response = await axios.post(
  `${apiUrl}/api/projects`,
  { name, link, description },
  { withCredentials: true }
)
```

**Get Single Project:**
```typescript
// File: frontend/src/app/dashboard/projects/[id]/page.tsx
const response = await axios.get(
  `${apiUrl}/api/projects/${id}`,
  { withCredentials: true }
)
```

**Update Project:**
```typescript
// File: frontend/src/app/dashboard/projects/[id]/page.tsx
const response = await axios.put(
  `${apiUrl}/api/projects/${id}`,
  { name, link, description, status },
  { withCredentials: true }
)
```

**Delete Project:**
```typescript
// File: frontend/src/app/dashboard/projects/page.tsx
const response = await axios.delete(
  `${apiUrl}/api/projects/${id}`,
  { withCredentials: true }
)
```

### Scan Execution Flow

**Run HTTP Observatory Scan:**
```typescript
// File: frontend/src/components/dashboard/http-observatory-card.tsx
const response = await axios.post(
  `${apiUrl}/api/projects/${projectId}/scan/mozilla`,
  {},
  { withCredentials: true }
)
```

**Run SSL Labs Scan:**
```typescript
// File: frontend/src/components/dashboard/ssl-labs-card.tsx
const response = await axios.post(
  `${apiUrl}/api/projects/${projectId}/scan/ssl`,
  {},
  { withCredentials: true }
)
```

**Get Latest HTTP Scan:**
```typescript
// File: frontend/src/components/dashboard/http-observatory-card.tsx
const response = await axios.get(
  `${apiUrl}/api/projects/${projectId}/scan/mozilla/latest`,
  { withCredentials: true }
)
```

**Get Latest SSL Scan:**
```typescript
// File: frontend/src/components/dashboard/ssl-labs-card.tsx
const response = await axios.get(
  `${apiUrl}/api/projects/${projectId}/scan/ssl/latest`,
  { withCredentials: true }
)
```

### Scan History Flow

**Get All Scans with Filters:**
```typescript
// File: frontend/src/components/dashboard/data-table.tsx
const params = new URLSearchParams({
  page: page.toString(),
  limit: pageSize.toString(),
  scanType,
})

if (selectedProject !== "all") {
  params.append("projectId", selectedProject)
}

if (debouncedSearch) {
  params.append("search", debouncedSearch)
}

const response = await axios.get(
  `${apiUrl}/api/projects/scans?${params.toString()}`,
  { withCredentials: true }
)
```

**Delete Scan:**
```typescript
// File: frontend/src/components/dashboard/data-table.tsx
const response = await axios.delete(
  `${apiUrl}/api/projects/scans`,
  {
    data: { 
      scanId, 
      scanType: scanType === "HTTP Observatory" ? "http" : "ssl" 
    },
    withCredentials: true
  }
)
```

### Analytics Flow

**Get Project Analytics:**
```typescript
// File: frontend/src/components/dashboard/chart-area-interactive.tsx
const response = await axios.get(
  `${apiUrl}/api/projects/${selectedProject}/analytics`,
  { withCredentials: true }
)
```

---

## Application Flow

### User Journey

1. **Landing Page**
   - User visits root URL (`/`)
   - Sees features, FAQs, call-to-action
   - Can navigate to sign-in or sign-up

2. **Registration**
   - User clicks "Get Started" or "Sign Up"
   - Navigates to `/sign-up`
   - Fills form (name, email, password)
   - Frontend: POST to `/api/auth/sign-up`
   - Backend: Creates user, returns JWT cookie
   - Redirects to `/dashboard`

3. **Login**
   - User navigates to `/sign-in`
   - Fills form (email, password)
   - Frontend: POST to `/api/auth/sign-in`
   - Backend: Validates credentials, returns JWT cookie
   - Redirects to `/dashboard`

4. **Dashboard Access**
   - Layout component: GET `/api/user/profile`
   - Validates JWT from cookie
   - Loads user data into sidebar
   - Displays dashboard content

5. **Project Creation**
   - User clicks "Quick Create" in sidebar
   - Navigates to `/dashboard/quick-create`
   - Fills form (name, URL, description)
   - Frontend: POST to `/api/projects`
   - Backend: Creates project with status="active"
   - Redirects to `/dashboard/projects`

6. **Viewing Projects**
   - User navigates to `/dashboard/projects`
   - Frontend: GET `/api/projects`
   - Displays project list with status indicators
   - Can click project to view details

7. **Project Details**
   - User clicks project card
   - Navigates to `/dashboard/projects/[id]`
   - Frontend: GET `/api/projects/:id`
   - Shows HTTP Observatory and SSL Labs cards
   - Can run scans or view latest results

8. **Running Scans**
   - **HTTP Observatory:**
     - User clicks "Run Scan" on HTTP card
     - Frontend: POST `/api/projects/:id/scan/mozilla`
     - Backend: Calls Observatory API with retry logic
     - Stores result in database
     - Returns scan data to frontend
     - Updates card with new grade/score
   
   - **SSL Labs:**
     - User clicks "Run Scan" on SSL card
     - Frontend: POST `/api/projects/:id/scan/ssl`
     - Backend: Calls SSL Labs API, polls for completion
     - Stores result in database
     - Returns scan data to frontend
     - Updates card with new grade/details

9. **Viewing Analytics**
   - Dashboard homepage shows chart for selected project
   - Frontend: GET `/api/projects/:id/analytics`
   - Backend: Fetches last 15 days of scans
   - Chart displays HTTP scores and SSL grades over time
   - User can switch between projects via dropdown

10. **Scan History**
    - User views DataTable on dashboard
    - Frontend: GET `/api/projects/scans` with filters
    - Backend: Returns paginated scan results
    - User can:
      - Search by project name (debounced)
      - Filter by project dropdown
      - Filter by scan type (HTTP/SSL/All)
      - Navigate pages
      - Delete individual scans
      - Click external links to full reports

11. **Account Management**
    - User clicks account dropdown (bottom left)
    - Selects "Account"
    - Navigates to `/dashboard/account`
    - Frontend: GET `/api/user/profile` (loads current data)
    - User edits name/email
    - Frontend: PATCH `/api/user/profile`
    - Backend: Validates email uniqueness, updates user
    - Shows success toast, refreshes page

12. **Logout**
    - User clicks account dropdown
    - Selects "Sign out"
    - Frontend: POST `/api/auth/sign-out`
    - Backend: Clears JWT cookie
    - Redirects to `/sign-in`

---

## Service Architecture

### Backend Services Structure

```
backend/src/
├── auth/
│   ├── controller.ts      # HTTP request handlers for auth
│   ├── service.ts         # Business logic (createUser, signInUser, updateUser)
│   ├── route.ts           # Express route definitions
│   ├── middleware.ts      # Input validation middleware
│   └── oauth.ts           # Google OAuth handler
├── user/
│   └── route.ts           # User profile route definitions
├── middlewares/
│   └── verifyToken.ts     # JWT authentication middleware
├── projects/
│   ├── route.ts           # Project route definitions
│   ├── controllers/
│   │   ├── project.controller.ts   # Project CRUD handlers
│   │   ├── scan.controller.ts      # Scan execution handlers
│   │   ├── scans.controller.ts     # Scan history handlers
│   │   └── analytics.controller.ts # Analytics handlers
│   └── services/
│       ├── service.ts              # Project CRUD business logic
│       ├── observatory.service.ts  # HTTP Observatory API integration
│       ├── ssllabs.service.ts      # SSL Labs API integration
│       ├── scans.service.ts        # Scan filtering/pagination logic
│       └── analytics.service.ts    # Analytics data aggregation
└── lib/
    └── prisma.ts          # Prisma client singleton
```

### Controller-Service Pattern

**Controllers:**
- Handle HTTP request/response
- Extract and validate parameters
- Call service functions
- Format responses
- Handle errors

**Services:**
- Contain business logic
- Interact with database (Prisma)
- Call external APIs
- Process and transform data
- Throw errors for controllers to catch

### Example Flow: Creating a Project

1. **Request:** `POST /api/projects` with body `{ name, link, description }`
2. **Route:** `projects/route.ts` matches route, applies `authenticateToken` middleware
3. **Middleware:** `verifyToken.ts` validates JWT, attaches `userId` to request
4. **Controller:** `createProject` in `project.controller.ts`
   - Extracts `userId` from request
   - Extracts `name, link, description` from body
   - Calls `createProject(userId, name, link, description)` service
5. **Service:** `createProject` in `service.ts`
   - Calls `prisma.projects.create()` with data
   - Returns created project object
6. **Controller:** Receives project from service
   - Formats as `{ success: true, data: project }`
   - Sends HTTP 201 response
7. **Frontend:** Receives response, updates UI

---

## Features List

### Authentication Features
- Email/password registration with bcrypt hashing
- Email/password login with JWT tokens
- Google OAuth 2.0 integration
- HttpOnly cookie-based session management
- Secure logout with cookie clearing
- Protected routes with JWT middleware
- Profile viewing (name, email)
- Profile editing (update name/email)
- Email uniqueness validation

### Project Management Features
- Create projects with name, URL, description
- List all user projects
- View single project details
- Update project information
- Delete projects (cascade deletes scans)
- Project status management (active/inactive)
- Status indicators throughout UI
- User ownership validation on all operations

### Security Scanning Features
- HTTP Observatory security scans
  - Security grade (A+ to F)
  - Numeric score (0-100+)
  - Tests passed/failed count
  - Link to detailed report
- SSL Labs TLS scans
  - SSL grade (A+ to F)
  - TLS protocol version support
  - Certificate details and expiration
  - Vulnerability checks (Heartbleed, POODLE, etc.)
  - HSTS policy detection
- Scan retry logic with exponential backoff
- Automatic scan result storage
- Latest scan retrieval per project
- Scan history tracking

### Analytics Features
- 15-day security score trends
- HTTP score line chart
- SSL grade visualization
- Per-project analytics
- Historical data comparison
- Interactive chart with project switcher

### Scan History Features
- Paginated scan table (10/20/30/50 per page)
- Project name search (case-insensitive, debounced)
- Filter by specific project
- Filter by scan type (HTTP/SSL/All)
- Date range filtering support
- Sort by scan date (newest first)
- Delete individual scans
- External report links
- Project status display
- Backend-powered search and filtering

### UI/UX Features
- Dark theme throughout
- Responsive design (mobile/tablet/desktop)
- Project grade cards on dashboard
- Status indicators (green=active, gray=inactive)
- Toast notifications for actions
- Loading states for async operations
- Confirmation dialogs for destructive actions
- Sidebar navigation
- Breadcrumb navigation
- Account dropdown menu
- Landing page with features/FAQs
- Anchor link navigation

### Data Management Features
- Server-side pagination
- Database-level filtering
- Case-insensitive search
- Cascade deletes for data integrity
- Indexed queries for performance
- Timestamp tracking (createdAt, updatedAt)
- Foreign key constraints
- Unique constraints on email

### Security Features
- JWT with secret key
- HttpOnly cookies (XSS protection)
- CORS configuration
- Password hashing with bcrypt
- User ownership validation
- Protected API routes
- OAuth state validation
- Secure cookie settings for production

### Developer Features
- TypeScript throughout
- Prisma ORM with type safety
- Centralized error handling
- Environment variable configuration
- Database migrations
- Seeded data support
- API health check endpoint
- Comprehensive logging
- Retry logic for external APIs
- Exponential backoff for reliability

---

## Error Handling

### Backend Error Patterns

**Authentication Errors:**
- 401 Unauthorized: Invalid/missing JWT
- 400 Bad Request: Invalid credentials
- 409 Conflict: Email already exists

**Authorization Errors:**
- 403 Forbidden: User doesn't own resource

**Validation Errors:**
- 400 Bad Request: Missing required fields
- 400 Bad Request: Invalid data format

**Resource Errors:**
- 404 Not Found: Resource doesn't exist

**External API Errors:**
- Retry up to 5 times with exponential backoff
- Return error message to frontend after all retries fail
- Log all attempts and failures

### Frontend Error Handling

All axios calls wrapped in try-catch:
```typescript
try {
  const response = await axios.post(url, data, config)
  // Handle success
} catch (error: any) {
  console.error("Error:", error)
  toast.error(error.response?.data?.message || "Operation failed")
}
```

---

## Configuration

### Backend Environment Variables
```env
DATABASE_URL              # PostgreSQL connection string
JWT_SECRET                # Secret key for JWT signing
PORT                      # Server port (default: 4000)
NODE_ENV                  # development | production
FRONTEND_URL              # Frontend URL for CORS
GOOGLE_CLIENT_ID          # Google OAuth client ID (optional)
GOOGLE_CLIENT_SECRET      # Google OAuth secret (optional)
GOOGLE_CALLBACK_URL       # OAuth callback URL (optional)
```

### Frontend Environment Variables
```env
NEXT_PUBLIC_BACKEND_URL   # Backend API base URL
```

---

## Database Indexes

Performance-optimized indexes:
- `HttpObservatoryScan`: Composite index on `[projectId, scannedAt]`
- `SSLLabsScan`: Composite index on `[projectId, scannedAt]`
- `Users`: Unique index on `email`

These indexes optimize:
- Project-specific scan queries
- Date-sorted scan retrieval
- Latest scan lookups
- Email uniqueness checks

---

## External API Integration

### HTTP Observatory API
- **Endpoint:** `https://observatory-api.mdn.mozilla.net/api/v2/scan`
- **Method:** POST
- **Rate Limit:** 1 scan per host per minute
- **Response Time:** 1-5 seconds typical
- **Retry Strategy:** 5 attempts, exponential backoff (1s→16s)
- **Timeout:** 45 seconds

### SSL Labs API
- **Endpoint:** `https://api.ssllabs.com/api/v3/analyze`
- **Method:** GET
- **Rate Limit:** Public tier limits apply
- **Response Time:** 2-5 minutes for new scans, instant for cached
- **Cache Duration:** 24 hours
- **Retry Strategy:** 5 attempts, exponential backoff
- **Timeout:** 60 seconds per request
- **Polling:** Checks every 10 seconds for up to 5 minutes

---

## Notes

- All timestamps stored in UTC
- Passwords never returned in API responses
- JWT expires in 2 days
- Scan results cached in database
- Projects cascade delete to scans
- User deletion cascades to projects and scans
- Search is debounced 300ms on frontend
- Pagination handled entirely in backend
- All dates formatted ISO 8601 in responses
