# ShopHub - Full-Stack E-Commerce Platform

A modern, mobile-friendly e-commerce website with:

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Prisma + SQLite (easily switchable to PostgreSQL)
- **Auth**: NextAuth.js (Credentials provider, role-based: USER / ADMIN)
- **Payments**: Stripe Checkout + Webhooks
- **State**: Zustand (persistent cart)
- **Dashboards**: User dashboard + Admin dashboard

## Features

- Product catalog with categories, search, filters, pagination
- Product detail pages with images
- Persistent shopping cart
- User registration & login
- Stripe-powered checkout
- Order history
- Admin dashboard (stats, recent orders/products)
- Fully responsive / mobile-friendly design
- Seeded demo data

## Quick Start

```bash
cd ecommerce-app

# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env and add your Stripe keys (optional for browsing)

# 3. Initialize database
npx prisma db push
npm run db:seed

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Accounts

| Role  | Email            | Password  |
|-------|------------------|-----------|
| Admin | admin@shop.com   | admin123  |
| User  | user@shop.com    | user123   |

## Stripe Setup (for real payments)

1. Create a Stripe account → https://dashboard.stripe.com
2. Get **Test** API keys from Developers → API keys
3. Add to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
4. For webhooks (local testing):
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Copy the webhook secret into `STRIPE_WEBHOOK_SECRET`

## Project Structure

```
src/
├── app/                  # Pages & API routes
│   ├── api/              # Backend endpoints
│   ├── auth/             # Sign in / Register
│   ├── products/         # Catalog + detail
│   ├── cart/             # Shopping cart
│   ├── dashboard/        # User dashboard
│   ├── admin/            # Admin dashboard
│   └── orders/           # Order success
├── components/           # UI components
├── lib/                  # Prisma, Auth, Stripe, utils
├── store/                # Zustand cart store
└── types/
prisma/
├── schema.prisma         # Database models
└── seed.ts               # Demo data
```

## Switching to PostgreSQL

1. Change `provider = "postgresql"` in `prisma/schema.prisma`
2. Update `DATABASE_URL` in `.env` to your Postgres connection string
3. Run `npx prisma db push && npm run db:seed`

## Extending

- Add product CRUD forms in `/admin`
- Add Google OAuth in `src/lib/auth.ts`
- Add reviews UI on product pages
- Add wishlist, coupons, inventory alerts, etc.

Built with ❤️ as a complete, production-ready foundation.
