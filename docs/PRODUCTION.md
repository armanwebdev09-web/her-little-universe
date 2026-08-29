# Production Deployment Guide — Her Little Universe 🚀

This document outlines the step-by-step production deployment process, security requirements, database migration commands, and environment variable configuration for **Her Little Universe**.

---

## 1. System Architecture Overview

```
[ Girlfriend / User ]
        │
        ▼ (HTTPS)
 [ Custom Production Domain ]
        │
        ├──────────────────────────┐
        ▼                          ▼
 [ Frontend (Vercel/Netlify) ]  [ Express Backend (Render/Railway) ]
                                   │
                                   ├──────────────► [ PostgreSQL (Neon/Supabase) ]
                                   │
                                   └──────────────► [ Protected Media Storage ]
```

---

## 2. Environment Variables Configuration

### Frontend (`.env`)
Configure these environment variables in your hosting provider (e.g., Vercel / Netlify):

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Public production URL of the Express API backend | `https://api.herlittleuniverse.com/api` |

### Backend (`backend/.env`)
Configure these environment variables in your backend hosting provider (e.g., Render / Railway):

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Express server port | `5000` |
| `FRONTEND_URL` | Allowed origin for CORS & cookies | `https://www.herlittleuniverse.com` |
| `DATABASE_URL` | Production PostgreSQL Connection String | `postgresql://user:pass@ep-prod.neon.tech/db?sslmode=require` |
| `ADMIN_JWT_SECRET` | Secure random string for Admin sessions | `e.g. 64-char hex string` |
| `SECRET_PASS_HASH` | Secure random hash for Secret Space auth | `e.g. 64-char hex string` |
| `SITE_TIMEZONE` | Timezone source of truth for release dates | `Asia/Kolkata` |

---

## 3. Database Migrations

Run production-safe database migrations on your PostgreSQL instance:

```bash
cd backend
npx prisma migrate deploy
```

> [!CAUTION]
> NEVER execute `npx prisma migrate reset` in production! Use `npx prisma migrate deploy` to safely apply pending migrations.

---

## 4. Frontend & Backend Build Commands

### Frontend Build
```bash
npm run build
```
Generates production-optimized minified assets in `dist/`.

### Backend Start
```bash
cd backend
npm start
```

---

## 5. Security & Protection Audit Checklist

- [x] **CORS Configuration**: Restricts access to `FRONTEND_URL` only with `credentials: true`.
- [x] **HTTP-Only Cookies**: Admin and Secret Space authentication cookies use `SameSite`, `HttpOnly`, and `Secure` flags.
- [x] **Rate Limiting**: Throttles `/api/auth/login` and `/api/secret/unlock` endpoints (max 20 requests per 15 minutes per IP).
- [x] **Server-Side Date Protection**: Future songs, letters, surprises, story events, and birthday content are strictly withheld on the backend until release dates.
- [x] **Private Media Gate**: All `/api/media/private/*` endpoints require Secret Authentication.

---

## 6. Rollback & Disaster Recovery Procedure

1. **Frontend Rollback**: In Vercel/Netlify dashboard, select previous deployment build and click **Promote to Production**.
2. **Backend Rollback**: Revert deployment commit on Railway/Render.
3. **Database Backup**: Periodic automated snapshots enabled via hosting provider (Neon/Supabase).
