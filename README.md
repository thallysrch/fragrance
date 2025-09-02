Perfume AI Shop – Next.js + Express + PostgreSQL

Stack
- Frontend: Next.js (App Router) + TailwindCSS
- Backend: Node.js/Express + Prisma
- Database: PostgreSQL (local via Docker) or Supabase (managed)
- Vision: Google Vision API (optional). Fallback mock included.

Monorepo
- apps/web – Next.js frontend
- apps/api – Express API

Getting Started (Local)
1) Start Postgres via Docker
   docker compose up -d

2) API – env, generate, push, seed
   cd apps/api
   cp .env.example .env
   npm i
   npx prisma generate
   npx prisma db push
   npm run seed
   npm run dev

   API available at http://localhost:4000

3) Web – env and dev
   cd apps/web
   cp .env.example .env
   npm i
   npm run dev

   Web available at http://localhost:3000

Required Endpoints
- POST /upload – image upload, returns detected perfume and matches
- GET /perfumes – list with filters: search, brand, gender, notes
- GET /perfumes/:id – details with rating aggregate
- GET /recomendacoes/:id – ranked similar alternatives
- POST /checkout – creates order (mock payment ref for Pix/Card/Boleto)

Supabase (Production)
- Create a new Supabase project
- Set DATABASE_URL in apps/api/.env to the Supabase connection string
- Run: npx prisma migrate deploy && npm run seed

Deploy
- Frontend (Vercel): import apps/web, set NEXT_PUBLIC_API_BASE_URL to your API URL
- Backend (Vercel or other): deploy apps/api as Node server (e.g., Render, Railway, Fly). For Vercel serverless you can port endpoints to Next API routes or use vercel functions; this repo keeps a classic Express server to simplify local dev.

Notes
- If GOOGLE_VISION_API_KEY is unset, the upload endpoint uses a filename-based mock to demonstrate flow.

