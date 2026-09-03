# Snap Order

> Modern inventory and order management dashboard with role-based access, email
> verification, and automated restock workflows.

**Live Demo**:
[snap-order-sigma.vercel.app](https://snap-order-sigma.vercel.app/)

---

## Overview

Snap Order is a full-stack web application that streamlines inventory tracking,
order processing, and restock management for small to medium businesses. Built
with a modern Next.js stack, it provides a public marketing homepage and
separate dashboards for administrators and regular users with appropriate access
controls.

### How It Works

1. **Users** register, verify their email, browse available products, complete a
   single-variant checkout with a Bangladesh shipping address
   (division/district/thana), track order status, and download PDF receipts once
   an order is confirmed.
2. **Admins** manage the product catalog, oversee all customer orders, update
   order statuses, approve/cancel automated restock requests, and generate
   invoices (receipts) when confirming orders.
3. **Restock automation** runs daily via a cron job — when product stock drops
   below the minimum threshold, a restock request is automatically generated for
   admin review.
4. **Email notifications** are sent for account creation, email verification
   (OTP), and password reset.

---

## Tech Stack

| Category   | Tech                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| Framework  | [Next.js 16](https://nextjs.org/) (App Router)                                                                     |
| Language   | [TypeScript](https://www.typescriptlang.org/) (strict)                                                             |
| UI         | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Database   | [PostgreSQL](https://www.postgresql.org/) via [Prisma ORM](https://www.prisma.io/)                                 |
| Auth       | JWT (dual-token: access + refresh) + bcrypt                                                                        |
| Validation | [Zod](https://zod.dev/)                                                                                            |
| Email      | [Nodemailer](https://nodemailer.com/) (Gmail OAuth2) + [React Email](https://react.email/)                         |
| Media      | [Cloudinary](https://cloudinary.com/)                                                                              |
| PDF        | [pdfkit](https://pdfkit.org/) (embedded Unicode fonts)                                                             |
| Deployment | [Vercel](https://vercel.com/)                                                                                      |

---

## Features

- **Marketing Homepage**: Public landing page with hero, feature highlights,
  workflow overview, and RBAC/security sections; auth-aware CTAs (Sign In vs
  Dashboard)
- **Authentication**: Registration, login, email verification (OTP), password
  reset
- **Role-Based Access**: USER and ADMIN roles with middleware-enforced route
  protection
- **Dashboard**: Role-specific overviews with key metrics
- **Product Management**: Create and edit products with auto-generated slugs,
  multiple Cloudinary images (min 1, first is primary), and multiple variants —
  each with its own SKU, stock, thresholds, prices, and structured attributes
- **Category Management**: Admin CRUD for categories with auto-generated slugs
  and image upload
- **Checkout Page**: Single-item checkout with variant selection chips, quantity
  controls, atomic stock deduction, and a cascading Bangladesh address form
  (division → district → thana/upazila via `@olism/bd-geo`); prices shown in
  Bangladeshi Taka (৳)
- **Order Processing**: Status tracking with lifecycle timestamps (PENDING →
  CONFIRMED → SHIPPED → DELIVERED), plus cancellations with a reason
- **Invoices & PDF Receipts**: Confirming an order auto-generates a user-only
  invoice (cards with status, recipient, and amount) and a downloadable
  pdfkit receipt with platform logo, slogan, gratitude text, line items, and
  totals — rendered with an embedded Taka-capable font
- **Automated Restock**: Daily cron checks stock thresholds, creates pending
  restock requests; admins approve with adjustable quantities
- **Customer Management**: Admin view of all registered users
- **Profile Management**: Update name, phone, and profile photo
- **Email Notifications**: Welcome emails, OTP verification, password reset
  codes

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Gmail account with OAuth2 credentials (for email)
- Cloudinary account (for image uploads)

### Installation

```bash
# Clone the repository
git clone https://github.com/programmerrakibul/snap-order.git
cd snap-order

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials (see Environment Variables below)

# Apply database migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Seed demo data (10 categories, 20 products)
npm run db:seed

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the public homepage, or
sign in to access the dashboard.

---

## Environment Variables

| Variable                            | Required | Description                                  |
| ----------------------------------- | -------- | -------------------------------------------- |
| `DATABASE_URL`                      | Yes      | PostgreSQL connection string                 |
| `ACCESS_TOKEN_SECRET`               | Yes      | JWT secret for access tokens (min 32 chars)  |
| `REFRESH_TOKEN_SECRET`              | Yes      | JWT secret for refresh tokens (min 32 chars) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Yes      | Cloudinary cloud name                        |
| `CLOUDINARY_API_KEY`                | Yes      | Cloudinary API key                           |
| `CLOUDINARY_API_SECRET`             | Yes      | Cloudinary API secret                        |
| `NEXT_PUBLIC_SITE_URL`              | Yes      | Application base URL                         |
| `GOOGLE_CLIENT_ID`                  | Yes      | Gmail OAuth2 client ID                       |
| `GOOGLE_CLIENT_SECRET`              | Yes      | Gmail OAuth2 client secret                   |
| `GOOGLE_REFRESH_TOKEN`              | Yes      | Gmail OAuth2 refresh token                   |
| `EMAIL_FROM_NAME`                   | Yes      | Sender display name                          |
| `EMAIL_FROM`                        | Yes      | Sender email address                         |
| `NODE_ENV`                          | Yes      | `development`, `production`, or `test`       |
| `CRON_SECRET`                       | No       | Bearer token for restock-check API endpoint  |
| `NEXT_PUBLIC_DEMO_EMAIL`            | No       | Pre-filled demo email on login form          |
| `NEXT_PUBLIC_DEMO_PASSWORD`         | No       | Pre-filled demo password on login form       |

---

## Scripts

| Command           | Description                            |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Start development server on port 3000  |
| `npm run build`   | Create production build                |
| `npm run start`   | Start production server                |
| `npm run lint`    | Run ESLint                             |
| `npm run clean`   | Remove build artifacts                 |
| `npm run db:seed` | Seed demo data (categories + products) |

---

## Project Structure

```
prisma/                         # Database schema, migrations, and seed (10 categories, 20 products)
src/
├── proxy.ts                    # Middleware — auth guard + token refresh
├── actions/server/             # Server Actions (auth, products, categories, orders, invoices, restock)
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Public marketing homepage
│   ├── auth/                   # Login, registration, forgot password
│   ├── dashboard/              # Protected pages (overview, products, checkout, orders, invoices, etc.)
│   │   ├── checkout/           # Single-product checkout (`?variantId=`)
│   │   ├── invoices/           # User-only receipt cards + PDF download
│   │   └── edit-product/[id]/  # Admin-only product & variant editor
│   └── api/restock-check/      # Cron endpoint for automated restock
├── assets/fonts/               # Bundled PDF fonts (NotoSansBengali for the ৳ glyph)
├── components/
│   ├── home/                   # Homepage sections (hero, features, workflow, roles)
│   ├── shared/                 # Navbar, footer, container, data table, slug input, image upload
│   ├── invoices/               # Invoice card + download-receipt button
│   ├── emails/                 # React Email templates
│   ├── forms/                  # Client form components (incl. variant-fields)
│   ├── modals/                 # Dialog/modal components
│   ├── tables/                 # Data table components
│   └── ui/                     # shadcn/ui primitives
├── lib/                        # Core utilities (Prisma, JWT, email, OTP, slug, validation)
├── providers/                  # React context providers
├── schemas/                    # Zod validation schemas
└── types/                      # TypeScript type definitions
```

---

## Database Schema

Ten models: **User**, **Category**, **Product**, **ProductImage**,
**ProductVariant**, **Order**, **OrderItem**, **Invoice**, **RestockRequest**,
**RestockRequestItem** — with full relational mapping for inventory (products
with variants and categories), orders, payments (invoices), and restock
workflows. Pricing and stock live on product **variants**; orders and restock
requests reference variants directly. Orders reference the buying user via
`customerId`, capture the full Bangladesh shipping details (division, district,
thana, area, phone, postal code), and record status timestamps (`confirmedAt`,
`shippedAt`, `deliveredAt`, `cancelledAt`); line items store `totalPrice` plus
an optional `discountAmount`. Confirming an order creates one linked **Invoice**
(`orderId @unique`) used for user-facing receipts. Removed variants are
soft-deactivated (`isActive = false`) so order and restock history stays intact.
The datamodel is split across `prisma/enums/` and `prisma/models/`. See
`prisma/` for details.

---

## API Architecture

Snap Order uses **Next.js Server Actions** for all data operations — there is no
traditional REST API. The only exception is `GET/POST /api/restock-check` which
is called by Vercel Cron. All server actions are defined in
`src/actions/server/` and are callable directly from client components. This
includes `invoice.action.ts` (auto-generate an invoice on order confirmation,
list the user's invoices, and return PDF receipts as base64 for client-side
download).

---

## Contact

**Md. Rakibul Islam**

- Portfolio: https://programmer-rakibul.vercel.app
- Email: rakibul00206@gmail.com
- WhatsApp: +880 188841-9206
