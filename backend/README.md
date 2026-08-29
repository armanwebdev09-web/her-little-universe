# HER LITTLE UNIVERSE - BACKEND API & DATABASE FOUNDATION

This directory contains the Express.js server, Prisma ORM schema, PostgreSQL database configuration, and secure authentication architecture for **Her Little Universe**.

## 🛠️ Architecture Overview

- **Backend Framework**: Node.js + Express.js
- **Database ORM**: Prisma ORM with PostgreSQL
- **Security**: Helmet, CORS origin restriction, Rate limiting, bcryptjs password hashing
- **Authentication**: JWT tokens transmitted exclusively via HTTP-only cookies (`admin_token` for Admin Panel, `secret_token` for Girlfriend Secret Folder)

---

## 🔑 Environment Variables (.env)

| Variable | Purpose |
| :--- | :--- |
| `PORT` | Backend server port (default `5000`) |
| `FRONTEND_URL` | Allowed CORS origin (default `http://localhost:5173`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT cookies |
| `SECRET_FOLDER_KEY_HASH` | Bcrypt hash for Secret Folder unlock key |

---

## ⚡ Setup & Commands

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Database Migrations & Prisma Commands
```bash
# Validate Prisma schema
npx prisma validate

# Generate Prisma Client
npx prisma generate

# Run Prisma Database Migrations
npx prisma migrate dev --name init

# Seed Development Data
npx prisma db seed
```

### 3. Run Development API Server
```bash
npm run dev
```

---

## 🚀 API Endpoints Overview

### Health
- `GET /api/health` — API status check

### Admin Authentication
- `POST /api/auth/login` — Verifies admin credentials and sets HTTP-only `admin_token` cookie
- `GET /api/auth/me` — Returns authenticated admin user profile
- `POST /api/auth/logout` — Clears admin session cookie

### Secret Folder Authentication
- `POST /api/secret/unlock` — Verifies secret key and sets HTTP-only `secret_token` cookie
- `GET /api/secret/items` — Protected endpoint returning private items (Requires `secret_token`)
- `POST /api/secret/lock` — Clears secret session cookie

---

## 🔒 Security Principles

1. **No Frontend Credential Exposure**: Admin and Secret Folder secrets are verified server-side.
2. **HTTP-only Cookie Protection**: JWT tokens are stored in `httpOnly: true` cookies to prevent XSS credential theft.
3. **Session Separation**: Admin management and Secret Folder guest access maintain strictly separate authentication sessions and cookies.
