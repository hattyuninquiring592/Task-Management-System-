# TaskFlow — Task Management System

A full-stack Task Management System built with **Node.js + TypeScript** (backend) and **Next.js + TypeScript** (frontend).

---

## 📁 Project Structure

```
task-manager/
├── backend/          # Node.js + TypeScript API
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── task.controller.ts
│   │   ├── lib/
│   │   │   ├── prisma.ts
│   │   │   └── jwt.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   └── task.routes.ts
│   │   ├── utils/
│   │   │   └── date.ts
│   │   └── index.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/         # Next.js 14 + TypeScript
    ├── src/
    │   ├── app/
    │   │   ├── (app)/
    │   │   │   ├── login/page.tsx
    │   │   │   ├── register/page.tsx
    │   │   │   ├── dashboard/
    │   │   │   │   ├── layout.tsx
    │   │   │   │   └── page.tsx
    │   │   │   └── layout.tsx
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── components/
    │   │   ├── TaskCard.tsx
    │   │   ├── TaskModal.tsx
    │   │   ├── DeleteDialog.tsx
    │   │   └── StatsCard.tsx
    │   ├── contexts/
    │   │   └── AuthContext.tsx
    │   ├── lib/
    │   │   ├── api.ts
    │   │   ├── auth.ts
    │   │   ├── tasks.ts
    │   │   └── utils.ts
    │   └── types/
    │       └── index.ts
    ├── .env.example
    ├── package.json
    ├── tailwind.config.ts
    └── tsconfig.json
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ (https://nodejs.org)
- **npm** v9+

---

## Backend Setup

### 1. Navigate to backend
```bash
cd task-manager/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment file
```bash
cp .env.example .env
```

Your `.env` should look like:
```env
DATABASE_URL="file:./dev.db"
JWT_ACCESS_SECRET="change-this-secret-in-production-abc123"
JWT_REFRESH_SECRET="change-this-other-secret-in-production-xyz789"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

### 4. Setup database
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start the backend
```bash
npm run dev
```

✅ Backend runs at: **http://localhost:5000**

---

## Frontend Setup

### 1. Navigate to frontend
```bash
cd task-manager/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment file
```bash
cp .env.example .env.local
```

`.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Start the frontend
```bash
npm run dev
```

✅ Frontend runs at: **http://localhost:3000**

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login | ❌ |
| POST | `/auth/refresh` | Refresh access token | ❌ (uses cookie) |
| POST | `/auth/logout` | Logout | ❌ |

### Tasks
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/tasks` | List tasks (paginated, filterable) | ✅ |
| POST | `/tasks` | Create task | ✅ |
| GET | `/tasks/:id` | Get single task | ✅ |
| PATCH | `/tasks/:id` | Update task | ✅ |
| DELETE | `/tasks/:id` | Delete task | ✅ |
| PATCH | `/tasks/:id/toggle` | Cycle task status | ✅ |

### Query Params for GET /tasks
| Param | Type | Example |
|-------|------|---------|
| `page` | number | `?page=2` |
| `limit` | number | `?limit=10` |
| `status` | string | `?status=PENDING` |
| `priority` | string | `?priority=HIGH` |
| `search` | string | `?search=meeting` |

---

## 🔒 Security Features

- **JWT Access Tokens** — short-lived (15min), sent in Authorization header
- **JWT Refresh Tokens** — long-lived (7 days), stored in HttpOnly cookie
- **Token Rotation** — new refresh token issued on every refresh
- **bcrypt** password hashing (12 salt rounds)
- **Input Validation** via express-validator + Zod
- **Auto token refresh** — Axios interceptor silently refreshes expired tokens

---

## 🎨 Frontend Features

- ✅ Login & Register with validation
- ✅ Dashboard with real-time stats (total, pending, in-progress, completed)
- ✅ Create, Edit, Delete tasks via modal
- ✅ Toggle task status (cycles: Pending → In Progress → Completed → Pending)
- ✅ Search tasks by title (debounced)
- ✅ Filter by status and priority
- ✅ Pagination
- ✅ Overdue date indicator
- ✅ Toast notifications for all actions
- ✅ Fully responsive (mobile + desktop)
- ✅ Dark mode design

---

## 🛠 Tech Stack

### Backend
- **Node.js + Express** — Server framework
- **TypeScript** — Type safety
- **Prisma ORM** — Database access
- **SQLite** — Database (swap to PostgreSQL for production)
- **JWT** — Authentication tokens
- **bcryptjs** — Password hashing
- **express-validator** — Input validation

### Frontend
- **Next.js 14** (App Router) — React framework
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **react-hook-form + Zod** — Form handling & validation
- **Axios** — HTTP client with interceptors
- **react-hot-toast** — Toast notifications
- **lucide-react** — Icons

---

## 🗄 Database Schema

```prisma
User {
  id           String
  email        String (unique)
  name         String
  passwordHash String
  tasks        Task[]
  refreshTokens RefreshToken[]
}

Task {
  id          String
  title       String
  description String?
  status      PENDING | IN_PROGRESS | COMPLETED
  priority    LOW | MEDIUM | HIGH
  dueDate     DateTime?
  userId      String (FK -> User)
}

RefreshToken {
  id        String
  token     String (unique)
  userId    String (FK -> User)
  expiresAt DateTime
}
```

---

## 📦 Production Deployment

### Switch to PostgreSQL
1. Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`
2. Update `DATABASE_URL` to your PostgreSQL connection string
3. Run `npx prisma migrate deploy`

### Environment Variables for Production
```env
NODE_ENV=production
JWT_ACCESS_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<different-strong-random-secret>
DATABASE_URL=postgresql://user:password@host:5432/dbname
CORS_ORIGIN=https://your-frontend-domain.com
```

---

## ❓ Troubleshooting

**"Cannot connect to backend"** — Make sure backend is running on port 5000 and `NEXT_PUBLIC_API_URL` is set correctly.

**"Prisma client not generated"** — Run `npx prisma generate` in the backend folder.

**CORS errors** — Check `CORS_ORIGIN` in backend `.env` matches your frontend URL exactly.
