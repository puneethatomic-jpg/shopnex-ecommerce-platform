# ShopNex — Modern E-Commerce Platform

A full-stack, production-ready e-commerce platform built with modern technologies.

## 🏗️ Architecture

```
ecommerce-platform/
├── frontend/          # Next.js (App Router, Tailwind CSS v4, shadcn/ui)
├── backend/           # Express.js (Prisma, PostgreSQL, Redis)
├── .github/workflows/ # CI/CD pipelines
├── docker-compose.yml # Local development services
└── README.md
```

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State**: React Context + TanStack Query
- **Auth**: Clerk
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: Sonner

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Caching**: Redis (ioredis)
- **Auth**: Clerk
- **Email**: Nodemailer (Ethereal for dev)
- **File Upload**: Cloudinary
- **Logging**: Winston + Morgan
- **Security**: Helmet, CORS, Rate Limiter
- **Validation**: Zod

## 📋 Prerequisites

- Node.js 20+
- Docker & Docker Compose (for local DB + Redis)
- Git

## ⚡ Quick Start

### 1. Clone and install

```bash
git clone <your-repo-url>
cd ecommerce-platform
```

### 2. Start local services (PostgreSQL + Redis)

```bash
docker compose up -d
```

This starts:
| Service | URL |
|---------|-----|
| PostgreSQL | `localhost:5432` |
| Redis | `localhost:6379` |
| pgAdmin | `http://localhost:5050` (admin@shopnex.com / admin) |
| Redis Commander | `http://localhost:8081` |

### 3. Setup Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run db:seed
npm run dev
```

Backend runs at `http://localhost:5000`

### 4. Setup Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

## 📁 Project Structure

### Frontend (`frontend/src/`)
```
app/              → Pages (App Router)
  (auth)/         → Auth pages (login, register)
  (shop)/         → Customer-facing pages
  admin/          → Admin dashboard
components/
  ui/             → shadcn/ui components
  layout/         → Navbar, Footer, Sidebar
  product/        → Product components
  cart/            → Cart components
  checkout/       → Checkout components
  admin/          → Admin components
hooks/            → Custom React hooks
lib/              → Utilities, API client
services/         → API service functions
store/            → React Context providers
```

### Backend (`backend/src/`)
```
config/           → DB, Redis, Cloudinary, Mail configs
controllers/      → Route handlers
middleware/       → Auth, validation, error handling
routes/           → Express routers
services/         → Business logic
repositories/     → Prisma data access
validators/       → Zod schemas
cache/            → Redis cache helpers
mail/             → Email templates and sender
utils/            → Helpers (logger, pagination, etc.)
prisma/           → Database schema and migrations
```

## 🗄️ Database

### Key Models
- **User** — Customer/Admin profiles (synced with Clerk)
- **Product** — Product catalog with images, categories, brands
- **Order** — Order management with status tracking
- **Cart** — Shopping cart with items
- **Wishlist** — User wishlists
- **Review** — Product reviews and ratings
- **Coupon** — Discount coupons
- **Address** — User shipping/billing addresses

### Useful Commands
```bash
npx prisma studio          # Visual database browser
npx prisma migrate dev     # Create/apply migrations
npx prisma db seed         # Seed sample data
npx prisma generate        # Regenerate client
```

## 🔑 Environment Variables

See `.env.example` in both `frontend/` and `backend/` directories.

### Required External Services
| Service | Purpose | Signup |
|---------|---------|--------|
| Clerk | Authentication | [clerk.com](https://clerk.com) |
| Cloudinary | Image uploads | [cloudinary.com](https://cloudinary.com) |

### Optional (for production)
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Neon/Supabase | Managed PostgreSQL |
| Upstash | Managed Redis |

## 🧪 Development

```bash
# Backend
cd backend && npm run dev      # Start with hot reload
cd backend && npm run lint     # Lint code

# Frontend
cd frontend && npm run dev     # Start dev server
cd frontend && npm run lint    # Lint code
cd frontend && npm run build   # Production build
```

## 🚢 Deployment

### Frontend → Vercel
1. Connect GitHub repo to Vercel
2. Set root directory to `frontend`
3. Add environment variables
4. Deploy

### Backend → Render
1. Connect GitHub repo to Render
2. Set root directory to `backend`
3. Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
4. Start command: `npm start`
5. Add environment variables

## 📜 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Current user |
| GET | `/api/products` | List products |
| GET | `/api/products/:id` | Product detail |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |
| GET | `/api/categories` | List categories |
| GET | `/api/cart` | Get cart |
| POST | `/api/cart` | Add to cart |
| GET | `/api/wishlist` | Get wishlist |
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | List orders |
| GET | `/api/reviews` | List reviews |
| POST | `/api/reviews` | Add review |

## 📄 License

MIT
