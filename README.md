# Veritas University — Academic Portal System

A full-stack university management platform for **Veritas University**. It combines a public marketing site with a secure, role-based academic portal serving three audiences: **students**, **faculty**, and the **director** (provost's office).

The application is split into two deployable pieces:

- **`frontend/`** — a Next.js 16 App Router application that renders the UI, hosts the auth flow, and acts as a Backend-for-Frontend (BFF) that proxies every data request to the API.
- **`backend/`** — an Express 5 + MongoDB API that owns authentication, authorization, and all academic records.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [Environment Variables](#environment-variables)
- [Seeding Demo Data](#seeding-demo-data)
- [API Reference](#api-reference)
- [Security Model](#security-model)
- [Available Scripts](#available-scripts)
- [Design System](#design-system)
- [Troubleshooting](#troubleshooting)

---

## Features

### Public site (`/`)

- Editorial-style university landing page with hero, institutional metrics, history, and campus-life sections.
- Filterable **Degree & Certification catalog** (bachelor's, master's/doctoral, professional certificates, diplomas).
- Clear entry point into the academic portal via `/login`.

### Student portal (`/student`)

- Personal profile card with GPA, completed credits, campus card balance, and attendance rate.
- **Weekly timetable** rendered from schedule data stored on the student record (Sunday–Thursday grid with lecture/lab/elective styling).
- Assigned faculty advisor card with office-hours details.
- Semester course gradebook and transcript actions.

### Faculty portal (`/faculty`)

- Course operations dashboard with active teaching roster and aggregate metrics.
- Live **gradebook** with midterm and lab scores, letter grades, exam bonuses, and academic-alert indicators.
- Attendance tracking (present / absent / late / excused) with bulk "mark all present" actions.
- Student filtering by academic alert and attendance status, plus CSV roster export.

### Director portal (`/director`)

- Executive overview with analytics for active faculty, enrolled students, and registry state.
- **Master timetable & facility allocation matrix** across campuses.
- Searchable **faculty registry** filtered by department and rank, with full dossier views.
- Searchable **student directory** with guardian, scholarship, and enrollment details.
- **Onboarding drawer** to enroll new students and faculty directly from the UI (creates the account and record in one step).

### Cross-cutting

- Cookie-based authentication with role-based route protection.
- Toast notifications, loading states, and graceful API error handling.
- Responsive Tailwind UI built on a shared "Academic Prestige" design system.

---

## Architecture

```
┌──────────────────────┐
│        Browser       │
│  (React 19 client)   │
└──────────┬───────────┘
           │  httpOnly cookie: veritas_token
           ▼
┌──────────────────────────────────────────────┐
│                Next.js 16 (BFF)              │
│                                              │
│  proxy.ts            → route-level RBAC      │
│  app/<role>/layout   → server-side requireRole│
│  /api/auth/login     → sets auth cookie      │
│  /api/auth/logout    → clears auth cookie    │
│  /api/backend/[...]  → authorized proxy      │
└──────────┬───────────────────────────────────┘
           │  Authorization: Bearer <JWT>
           │  X-Internal-Secret: <shared secret>
           ▼
┌──────────────────────────────────────────────┐
│             Express 5 API (:5000)            │
│                                              │
│  verifyInternalSecret → only the BFF may call│
│  verifyToken          → validates JWT        │
│  authorizeRoles       → per-route RBAC       │
└──────────┬───────────────────────────────────┘
           ▼
┌──────────────────────┐
│   MongoDB (Mongoose) │
│  users / students /  │
│  teachers            │
└──────────────────────┘
```

**Why a BFF?** The JWT is stored in an `httpOnly` cookie, so JavaScript in the browser can never read it. The Next.js server verifies that cookie, enforces role rules, and forwards the token to Express. Express in turn refuses any request that does not carry the shared internal secret, so the API cannot be called directly from outside the deployment.

---

## Tech Stack

| Layer      | Technology                                                                 |
| ---------- | -------------------------------------------------------------------------- |
| Frontend   | Next.js `16.4.3` (App Router), React `19.3.1`, TypeScript `5.7.3`           |
| Styling    | Tailwind CSS `3.4.17`, PostCSS, Autoprefixer, Material Symbols icons        |
| Backend    | Node.js, Express `5.3`, Mongoose `9.11`, MongoDB                            |
| Auth       | `jsonwebtoken` (HS256), `bcrypt` password hashing, `httpOnly` cookies       |
| Tooling    | ESLint 9 (`eslint-config-next`), `tsc --noEmit` for type checking           |

---

## Project Structure

```
university platform/
├── backend/
│   ├── config/
│   │   ├── db.js                     # Mongo connection
│   │   └── defaultClassBlockProps.js  # Default student timetable
│   ├── controllers/
│   │   ├── authController.js          # Login + JWT issuance
│   │   ├── studentController.js       # Student CRUD, profile, roster
│   │   └── facultyController.js       # Teacher CRUD, roster linking
│   ├── middleware/
│   │   └── authMiddleware.js          # Internal secret, JWT, role guards
│   ├── models/
│   │   ├── User.js                    # email, password hash, role
│   │   ├── Student.js                 # profile, timetable, roster metadata
│   │   └── Teacher.js                 # department, rank, assigned students
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   └── facultyRoutes.js
│   ├── scripts/
│   │   ├── seedPortalData.js          # Demo students + timetable data
│   │   └── backfillRosterFields.js    # Migrate legacy records
│   ├── server.js                      # App entry point
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── api/
    │   │   ├── auth/login/route.ts     # Signs the cookie
    │   │   ├── auth/logout/route.ts    # Clears the cookie
    │   │   └── backend/[...path]/route.ts  # Authorized API proxy
    │   ├── director/                  # Director portal + role layout
    │   ├── faculty/                   # Faculty portal + role layout
    │   ├── student/                   # Student portal + role layout
    │   ├── login/                     # Sign-in screen
    │   ├── layout.tsx                 # Root layout, fonts, toast provider
    │   └── page.tsx                   # Public landing page
    ├── components/
    │   ├── auth-screen.tsx
    │   ├── onboard-drawer.tsx         # Director enrollment forms
    │   ├── logout-button.tsx
    │   └── toast-provider.tsx
    ├── lib/
    │   ├── api.ts                     # Typed API client
    │   ├── auth.ts                    # Client login/logout
    │   ├── auth-server.ts             # Server-side requireRole()
    │   ├── auth-token.ts              # JWT verification + cookie config
    │   └── types.ts                   # Shared domain types
    ├── proxy.ts                       # Route protection (Next 16 middleware)
    └── tailwind.config.ts             # Design tokens
```

---

## Getting Started

### Prerequisites

- **Node.js 20+**
- **MongoDB** — a local instance or a MongoDB Atlas connection string
- **npm** (a `package-lock.json` is present in both packages)

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URL=mongodb://127.0.0.1:27017/veritas
JWT_SECRET=replace-with-a-long-random-string
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
INTERNAL_API_SECRET=replace-with-another-long-random-string
SEED_STUDENT_PASSWORD=student123
```

Generate strong secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Start the API:

```bash
node server.js
# → Server running on port 5000
# → MongoDB Connected: <host>
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
BACKEND_URL=http://localhost:5000
JWT_SECRET=replace-with-the-same-value-as-the-backend
INTERNAL_API_SECRET=replace-with-the-same-value-as-the-backend
```

> `JWT_SECRET` and `INTERNAL_API_SECRET` **must match** the backend values exactly. The frontend uses the first to verify the cookie signature and the second to authenticate to the API.

Start the app:

```bash
npm run dev
# → http://localhost:3000
```

Open the site, click **Log In**, and sign in with a seeded student account (see below) or an account you provision yourself.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable                | Required | Description                                                        |
| ----------------------- | :------: | ------------------------------------------------------------------ |
| `PORT`                  |    No    | API port (default `5000`).                                         |
| `NODE_ENV`              |    No    | Runtime mode.                                                      |
| `MONGO_URL`             |   Yes    | MongoDB connection string (`MONGO_URI` is accepted as a fallback). |
| `JWT_SECRET`            |   Yes    | Secret used to sign and verify HS256 JWTs.                         |
| `JWT_EXPIRES_IN`        |    No    | Token lifetime (default `7d`).                                     |
| `FRONTEND_URL`          |    No    | Allowed CORS origin (default `http://localhost:3000`).             |
| `INTERNAL_API_SECRET`   |   Yes    | Shared secret the BFF must send in `X-Internal-Secret`.            |
| `SEED_STUDENT_PASSWORD` | Seed only| Password assigned to every seeded demo student.                    |

### Frontend (`frontend/.env`)

| Variable              | Required | Description                                          |
| --------------------- | :------: | ---------------------------------------------------- |
| `BACKEND_URL`         |   Yes    | Base URL of the Express API (e.g. `http://localhost:5000`). |
| `JWT_SECRET`          |   Yes    | Must equal the backend `JWT_SECRET`.                 |
| `INTERNAL_API_SECRET` |   Yes    | Must equal the backend `INTERNAL_API_SECRET`.        |

`.env` files are git-ignored. Never commit real secrets.

---

## Seeding Demo Data

The seed script creates five demo students, assigns them a shared weekly timetable, and links every existing teacher to the full student roster.

```bash
cd backend
npm run seed:portal
```

It is **idempotent** — re-running updates existing records instead of duplicating them. The script prints the demo password from `SEED_STUDENT_PASSWORD` when finished.

Demo student accounts:

| Name            | Email                          | Student ID  | Major               |
| --------------- | ------------------------------ | ----------- | ------------------- |
| Marcus Sterling | `marcus.sterling@veritas.edu`  | `VU-883109` | B.S. Comp. Science  |
| Elena Rostova   | `elena.rostova@veritas.edu`    | `VU-884210` | B.S. Software Eng.  |
| Devaughn Miller | `devaughn.miller@veritas.edu`  | `VU-879942` | B.S. Comp. Science  |
| Zhiyuan Chen    | `zhiyuan.chen@veritas.edu`     | `VU-881029` | B.S. Math & CS      |
| Maya Lin-Torres | `maya.lin-torres@veritas.edu`  | `VU-890123` | B.S. Comp. Science  |

**Faculty and director accounts are not seeded.** Provision them one of two ways:

1. **Director onboarding UI** — once a director exists, sign in as director and use the onboarding drawer to create faculty accounts.
2. **Direct database insert** — create a `users` document with a bcrypt-hashed password and role `director` or `faculty`, then create the matching `teachers` document referencing it. Every field name is defined in `backend/models/`.

### Backfilling legacy records

If existing students are missing timetable data or are not linked to teachers, run:

```bash
cd backend
npm run backfill:roster
```

---

## API Reference

All routes are prefixed with `/api`. The browser never calls this API directly — it goes through the Next.js proxy at `/api/backend/*`.

A request must carry:

- `X-Internal-Secret: <INTERNAL_API_SECRET>` (checked on every route, including login)
- `Authorization: Bearer <JWT>` (checked on all routes except login/logout)

### Auth

| Method | Endpoint      | Access | Description                              |
| ------ | ------------- | ------ | ---------------------------------------- |
| `POST` | `/auth/login` | Public (BFF only) | Validates credentials and returns a JWT. |
| `POST` | `/auth/logout`| Public (BFF only) | Acknowledges logout.                     |

### Students

| Method  | Endpoint           | Access              | Description                                  |
| ------- | ------------------ | ------------------- | -------------------------------------------- |
| `GET`   | `/student`         | Director            | List all students.                           |
| `GET`   | `/student/profile` | Student             | Current student's own profile.               |
| `GET`   | `/student/:id`     | Director, Faculty   | Single student by ID.                        |
| `POST`  | `/student`         | Director            | Create a user + student record.              |
| `PATCH` | `/student/:id`     | Director, Faculty   | Update scores, attendance, roster, timetable.|

### Faculty

| Method | Endpoint                   | Access            | Description                                  |
| ------ | -------------------------- | ----------------- | -------------------------------------------- |
| `GET`  | `/faculty`                 | Director          | List all teachers.                           |
| `GET`  | `/faculty/profile`         | Faculty           | Current teacher's own profile.               |
| `GET`  | `/faculty/:id/students`    | Director, Faculty | Teacher's assigned student roster (populated).|
| `POST` | `/faculty`                 | Director          | Create a user + teacher record.              |
| `PUT`  | `/faculty/:id/students`    | Director          | Replace the teacher's assigned student list. |

### Example: proxy request from the client

```ts
import { api } from "@/lib/api";

const profile = await api.student.getProfile();
const roster = await api.director.listStudents();
```

`apiFetch` adds credentials, a 15-second timeout, JSON parsing, and automatic redirect to `/login` on `401`.

---

## Security Model

Authentication is enforced at **four layers**:

1. **Cookie-only token storage** — the JWT is set as `veritas_token` with `httpOnly`, `sameSite=lax`, `path=/`, `secure` in production, and a 7-day lifetime. Client-side JavaScript cannot read it.
2. **Signature verification in Next.js** (`lib/auth-token.ts`) — the HS256 signature is recomputed with `createHmac` and compared using `timingSafeEqual` before any claim is trusted. Expired, forged, or malformed tokens are rejected.
3. **Route protection** — `proxy.ts` guards `/student`, `/faculty`, and `/director` before rendering, redirecting mismatched roles to `/login`. Each portal layout also calls `requireRole()` server-side as defense in depth.
4. **BFF authorization + internal secret** — the proxy route re-checks the role against the requested resource and method before forwarding. It attaches the `Authorization` and `X-Internal-Secret` headers; Express rejects anything without the correct internal secret using a timing-safe comparison.

Additional hardening:

- Passwords are hashed with **bcrypt** (cost factor 10).
- Login returns the same generic error for unknown emails and wrong passwords.
- The proxy uses an allow-list of resources (`student`, `faculty`) and rejects path-traversal segments.
- Upstream `401` responses clear both the current and legacy auth cookies.
- All proxied responses are sent with `Cache-Control: no-store`.

---

## Available Scripts

### Backend (`cd backend`)

| Command                  | Description                                                    |
| ------------------------ | -------------------------------------------------------------- |
| `node server.js`         | Start the API.                                                 |
| `npm run seed:portal`    | Seed demo students, timetables, and teacher-student links.     |
| `npm run backfill:roster`| Backfill timetables and teacher rosters on existing records.   |

### Frontend (`cd frontend`)

| Command             | Description                             |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Start the development server.           |
| `npm run build`     | Production build.                       |
| `npm run start`     | Serve the production build.             |
| `npm run lint`      | Run ESLint.                             |
| `npm run typecheck` | Run `tsc --noEmit`.                     |

---

## Design System

The UI follows a "Academic Prestige" theme defined in `frontend/tailwind.config.ts`:

- **Palette** — deep navy `primary` (`#002046`), warm gold `secondary` (`#775a19`), and a cool off-white `surface` (`#faf8ff`).
- **Typography** — *Merriweather* for headlines, *Inter* for body and labels, with a monospace-style label scale for metadata.
- **Tokens** — semantic color names (`surface-container-low`, `on-primary-container`, …), spacing scale (`space-xs` → `space-xl`), and heading sizes are exposed as Tailwind utilities.
- **Icons** — Google Material Symbols Outlined, loaded in the root layout.

---

## Troubleshooting

| Symptom                                             | Likely cause / fix                                                                 |
| --------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `MongoDB connection error` on startup               | `MONGO_URL` is missing or unreachable. Check the URI and network access.           |
| Login succeeds but every page redirects to `/login` | `JWT_SECRET` differs between frontend and backend, so the cookie cannot be verified.|
| API returns `403 Direct API access is not permitted`| `INTERNAL_API_SECRET` is missing or mismatched in either `.env`.                   |
| `Unable to reach the API server` in the UI          | `BACKEND_URL` is wrong or the Express server is not running.                       |
| `401` immediately after signing in                  | Token expired, or backend/frontend clocks are far apart.                           |
| Director/faculty login fails                        | Those accounts are not seeded — provision them in MongoDB or via the onboarding UI.|

---

**Project name:** Veritas University Academic Portal (`veritas-university-portal`)
