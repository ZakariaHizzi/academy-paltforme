# Veritas University Academic Portal

A full-stack university platform that combines a public university website with a secure, role-based academic portal for **students**, **faculty**, and the **director**.

The project is split into a **Next.js 16 / React 19** frontend and an **Express 5 / MongoDB** backend. The browser-facing app acts as a Backend-for-Frontend (BFF): authentication cookies, role checks, and a guarded API proxy sit in Next.js, while Express exposes the data API only to trusted requests carrying an internal shared secret.

---

## Overview

| Area | Description |
| --- | --- |
| Public site | University landing page with hero, institutional metrics, degree catalog with category filters, campus life, and a link to the portal login. |
| Authentication | Email/password login, bcrypt password hashing, JWT (HS256) stored in an HttpOnly cookie, automatic logout/redirect on expired sessions. |
| Student portal | Academic dashboard with GPA, completed credits, campus card balance, weekly timetable, and a semester gradebook. |
| Faculty portal | Class metrics, student roster, attendance status, inline grade/score updates, filters, CSV export, and announcement composition. |
| Director portal | Institutional governance dashboard, registry metrics, faculty and student onboarding, roster assignment, and operational/executive tools. |
| Data layer | MongoDB models for users, student academic records, teacher rosters, timetables, and gradebook metadata. |

> Some higher-level executive actions in the director and faculty dashboards (reports, treasury, audit vault, room reallocation, etc.) are presentation-only interactions that display toast notifications. The persisted flows are authentication, profiles, student/faculty creation, roster assignment, and student record updates.

---

## Architecture

```text
Browser
  │
  ▼
Next.js frontend (port 3000)
  ├── Public pages and role dashboards
  ├── Cookie-based session + route protection (proxy.ts)
  ├── /api/auth/login, /api/auth/logout
  └── /api/backend/*  ──►  Express backend (port 5000)
                              ├── X-Internal-Secret verification
                              ├── JWT + role verification
                              └── Mongoose  ──►  MongoDB
```

**Why the BFF?** The Express API is never called directly from the browser. Next.js holds the JWT cookie and forwards it as a Bearer token, adds the internal secret, validates the session, and enforces role access before the request reaches Express. This keeps tokens out of client-side JavaScript and prevents bypassing the gateway.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 3 |
| Styling | Material-inspired custom design tokens, Inter + Merriweather, Material Symbols |
| Backend | Node.js, Express 5, Mongoose 9 |
| Database | MongoDB (local or Atlas) |
| Auth | bcrypt, JSON Web Tokens (HS256), HttpOnly cookies |
| Tooling | ESLint, TypeScript, npm |

---

## Project structure

```text
university platform/
├── backend/
│   ├── config/
│   │   ├── db.js                       # MongoDB connection
│   │   └── defaultClassBlockProps.js   # Default seeded timetable blocks
│   ├── controllers/                    # Auth, student, and faculty logic
│   ├── middleware/                     # Internal-secret, JWT, and role guards
│   ├── models/                         # User, Student, Teacher schemas
│   ├── routes/                         # Express route definitions
│   ├── scripts/
│   │   ├── seedPortalData.js           # Demo students, timetables, rosters
│   │   └── backfillRosterFields.js     # Backfill timetable/roster fields
│   └── server.js                       # Express entry point
├── frontend/
│   ├── app/
│   │   ├── page.tsx                    # Public landing page
│   │   ├── login/                      # Sign-in screen
│   │   ├── student/                    # Student dashboard
│   │   ├── faculty/                    # Faculty dashboard
│   │   ├── director/                   # Director dashboard
│   │   └── api/                        # BFF auth + backend proxy routes
│   ├── components/                     # Auth screen, onboarding drawer, toasts
│   ├── lib/                            # API client, auth helpers, types
│   ├── proxy.ts                        # Role-based route protection
│   └── next.config.ts
├── .gitignore
└── README.md
```

---

## Getting started

### Prerequisites

- Node.js 20 or newer
- npm
- A MongoDB database (local instance or MongoDB Atlas)

### 1. Clone and install

```bash
git clone https://github.com/ZakariaHizzi/academy-paltforme.git
cd academy-paltforme

cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure the backend

Create `backend/.env` (it is git-ignored):

```env
PORT=5000
NODE_ENV=development
MONGO_URL=mongodb://127.0.0.1:27017/veritas
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
INTERNAL_API_SECRET=replace-with-another-long-random-secret
SEED_STUDENT_PASSWORD=replace-with-a-demo-password
```

### 3. Configure the frontend

Create `frontend/.env`:

```env
BACKEND_URL=http://localhost:5000
JWT_SECRET=the-same-value-as-backend-JWT_SECRET
INTERNAL_API_SECRET=the-same-value-as-backend-INTERNAL_API_SECRET
```

`JWT_SECRET` must match on both sides so Next.js can verify the token issued by Express. `INTERNAL_API_SECRET` must also match, because Next.js sends it as `X-Internal-Secret` and Express rejects requests without it.

### 4. Run the backend

```bash
cd backend
node server.js
```

The API starts on `http://localhost:5000`.

### 5. Run the frontend

In a second terminal:

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000`.

---

## Environment variables

### Backend

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | Express port (default `5000`). |
| `NODE_ENV` | No | Runtime environment. |
| `MONGO_URL` | Yes | MongoDB connection string (`MONGO_URI` is also accepted). |
| `JWT_SECRET` | Yes | Signs and verifies JWTs. |
| `JWT_EXPIRES_IN` | Yes | Token lifetime, e.g. `7d`. |
| `FRONTEND_URL` | No | Allowed CORS origin (default `http://localhost:3000`). |
| `INTERNAL_API_SECRET` | Yes | Shared secret checked on every Express request. |
| `SEED_STUDENT_PASSWORD` | Seed only | Password assigned to demo student accounts. |

### Frontend

| Variable | Required | Purpose |
| --- | --- | --- |
| `BACKEND_URL` | Yes | Express API base URL used by the BFF. |
| `JWT_SECRET` | Yes | Verifies backend-issued JWTs in middleware and route handlers. |
| `INTERNAL_API_SECRET` | Yes | Secret forwarded to Express as `X-Internal-Secret`. |

> Never commit real `.env` files or production secrets. The repository root `.gitignore` excludes `.env` files.

---

## Demo data and accounts

The backend includes a seed script that creates five demo students, applies a weekly timetable, fills gradebook/attendance metadata, and links students to existing teacher rosters.

```bash
cd backend
npm run seed:portal
```

The script uses `SEED_STUDENT_PASSWORD` as the password for the demo student accounts.

| Name | Email | Student ID |
| --- | --- | --- |
| Marcus Sterling | `marcus.sterling@veritas.edu` | `VU-883109` |
| Elena Rostova | `elena.rostova@veritas.edu` | `VU-884210` |
| Devaughn Miller | `devaughn.miller@veritas.edu` | `VU-879942` |
| Zhiyuan Chen | `zhiyuan.chen@veritas.edu` | `VU-881029` |
| Maya Lin-Torres | `maya.lin-torres@veritas.edu` | `VU-890123` |

The seed script **does not create faculty or director accounts**. Faculty accounts can be created from the director portal (which uses `POST /api/faculty`). To bootstrap the first director account, create it directly in MongoDB with a bcrypt-hashed password, for example from the `backend` directory:

```bash
node -e "require('dotenv').config(); const mongoose=require('mongoose'); const bcrypt=require('bcrypt'); const User=require('./models/User'); (async()=>{await mongoose.connect(process.env.MONGO_URL); await User.create({email:'director@veritas.edu',password:await bcrypt.hash(process.env.SEED_STUDENT_PASSWORD || 'ChangeMe123!',10),role:'director'}); console.log('Director account created'); await mongoose.disconnect();})()"
```

Change the password before using this outside local development.

### Maintenance script

If you already have older records without timetable or roster data:

```bash
cd backend
npm run backfill:roster
```

This fills missing `classBlockProps` on students and links all students to teachers that have an empty roster.

---

## API reference

All Express routes are protected by the internal secret. In normal use, the browser calls the matching Next.js BFF endpoint under `/api/backend/*`, which adds both the secret and the user's Bearer token.

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | Public (via BFF) | Validate credentials and return a JWT. |
| `POST` | `/api/auth/logout` | Public (via BFF) | Clear the session on the Next.js side. |

### Students

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/student` | Director | List all students with linked user emails. |
| `GET` | `/api/student/profile` | Student | Get the signed-in student's profile. |
| `GET` | `/api/student/:id` | Director, faculty | Get a student by ObjectId or student ID. |
| `POST` | `/api/student` | Director | Create a user + student record. |
| `PATCH` | `/api/student/:id` | Director, faculty | Update academic, timetable, or roster fields. |

### Faculty

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/faculty` | Director | List teachers and their rosters. |
| `GET` | `/api/faculty/profile` | Faculty | Get the signed-in teacher's profile and roster. |
| `GET` | `/api/faculty/:id/students` | Director, faculty | Get one teacher's student roster. |
| `POST` | `/api/faculty` | Director | Create a user + teacher record. |
| `PUT` | `/api/faculty/:id/students` | Director | Replace a teacher's assigned students. |

---

## Security model

- **Password hashing** — Passwords are hashed with bcrypt (cost 10) before storage.
- **JWT authentication** — Tokens are signed with `JWT_SECRET`, expire according to `JWT_EXPIRES_IN`, and are stored in an HttpOnly, SameSite=Lax cookie (`veritas_token`).
- **Cookie verification in Next.js** — `lib/auth-token.ts` verifies the HS256 signature with `timingSafeEqual` before trusting any claim.
- **Route protection** — `proxy.ts` redirects unauthenticated or wrong-role users away from `/student`, `/faculty`, and `/director`, and clears invalid cookies.
- **BFF authorization** — The `/api/backend/[...path]` handler validates the session, restricts allowed resources, enforces role access, and forwards the Bearer token plus `X-Internal-Secret`.
- **Backend lockdown** — Express compares `X-Internal-Secret` with `timingSafeEqual` and rejects direct external requests, then applies JWT and role checks per route.
- **Input validation** — Controllers validate required fields, shapes, allowed enum values, numeric ranges, ObjectIds, and duplicate emails/student IDs.
- **Response hygiene** — API and auth responses use `Cache-Control: no-store`; 401 responses clear stale cookies.

---

## Data model

### `User`

Account identity and role.

- `email` — unique, lowercased
- `password` — bcrypt hash
- `role` — `student`, `faculty`, or `director`

### `Student`

Academic record linked one-to-one with a `User`.

- Identity: `name`, `studentId` (unique), `major`
- Progress: `gpa` (0–4), `creditsCompleted`, `campusCardBalance`
- `classBlockProps[]` — timetable blocks with course code, title, room, instructor, day, start/end time, and display classes
- `roster` — gradebook and attendance metadata: year, track, midterm/lab scores, letter grade, attendance, dossier status, academic alert, exam bonus

### `Teacher`

Faculty record linked one-to-one with a `User`.

- Identity and role: `name`, `department`, `rank`, `office`
- Workload: `teachingLoad`
- `students[]` — references to assigned `Student` documents

---

## Available scripts

| Location | Command | Description |
| --- | --- | --- |
| `frontend` | `npm run dev` | Start the development server. |
| `frontend` | `npm run build` | Create a production build. |
| `frontend` | `npm run start` | Run the production build. |
| `frontend` | `npm run lint` | Run ESLint. |
| `frontend` | `npm run typecheck` | Run TypeScript without emitting files. |
| `backend` | `node server.js` | Start the API server. |
| `backend` | `npm run seed:portal` | Seed demo students, timetables, and rosters. |
| `backend` | `npm run backfill:roster` | Backfill timetable and roster fields. |

There is currently no automated test suite in the repository.

---

## Design notes

- The public site and portals share a custom Material-inspired Tailwind palette (`surface`, `primary`, `secondary`, `tertiary`, etc.) defined in `frontend/tailwind.config.ts` and `frontend/app/globals.css`.
- Typography combines **Inter** for UI text, **Merriweather** for editorial headings, and **Material Symbols Outlined** for icons, loaded from Google Fonts in the root layout.
- Dashboards are responsive and use live API data where available, with demo-oriented controls for workflows that do not yet have backend support.

---

## License

No license has been declared for this project. Treat it as an educational/portfolio project unless a license is added.
