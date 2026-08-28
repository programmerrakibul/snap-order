# AGENTS.md — Snap Order

## Project Overview

Snap Order is a full-stack inventory & order management dashboard built with
**Next.js 16 (App Router) + TypeScript + Prisma + PostgreSQL**. It uses Next.js
Server Actions for all data mutations (no REST API except one cron endpoint).
Role-based access (USER / ADMIN) is enforced at middleware, server action, and
UI levels.

---

## Architecture

| Layer           | Technology                                                   |
| --------------- | ------------------------------------------------------------ |
| Framework       | Next.js 16 (App Router)                                      |
| Language        | TypeScript (strict mode)                                     |
| UI              | React 19 + Tailwind CSS v4 + shadcn/ui                       |
| Forms           | react-hook-form + @hookform/resolvers (Zod)                  |
| Database        | PostgreSQL via Prisma ORM (driver adapters)                  |
| Auth            | Dual JWT (access 15m + refresh 7d), httpOnly cookies, bcrypt |
| Email           | Nodemailer (Gmail OAuth2) + React Email templates            |
| Uploads         | Cloudinary                                                   |
| Validation      | Zod (env vars, inputs, schemas)                              |
| Package Manager | npm                                                          |

---

## Folder Structure

```
prisma/
├── schema.prisma               # generator (prisma-client → src/generated/prisma) + datasource
├── enums/                      # Role, OrderStatus, RestockStatus, ProductStatus, DiscountType
├── models/                     # User, Category, Product, ProductImage, ProductVariant, Order, ...
├── seed.ts                     # Idempotent seed — 10 categories + 20 products (upserts)
└── migrations/                 # SQL migration history
src/
├── proxy.ts                     # Next.js middleware — auth guard + token refresh
├── actions/server/              # Server Actions (data mutations)
│   ├── user.action.ts           # Auth, profile, verification, password reset
│   ├── product.action.ts        # Product CRUD + variants + images (edit/manage)
│   ├── category.action.ts       # Category CRUD + slug handling
│   ├── order.action.ts          # Order CRUD + status management
│   ├── restock.action.ts        # Restock approve/cancel
│   ├── overview.action.ts       # Dashboard stats
│   ├── cookie.ts                # JWT cookie helpers
│   ├── getAccessToken.ts        # Read access token from cookie
│   ├── isAuthenticated.ts       # Auth check with auto-refresh
│   ├── refreshToken.ts          # Token refresh logic
│   └── uploadToCloudinary.ts    # Image upload helper
├── app/                         # Next.js App Router pages
│   ├── page.tsx                 # Public marketing homepage
│   ├── auth/                    # signin, signup, forgot-password
│   ├── dashboard/               # Protected pages
│   │   ├── layout.tsx           # Sidebar + SiteHeader + UserProvider
│   │   ├── _component/          # admin-overview, user-overview
│   │   ├── add-products/        # Admin only
│   │   ├── edit-product/[id]/   # Admin only — edit product + manage variants
│   │   ├── products/            # Product listing
│   │   ├── categories/          # Admin only — category CRUD
│   │   ├── orders/              # Order listing
│   │   ├── customers/           # Admin only
│   │   ├── profile/             # User profile
│   │   └── restock-products/    # Admin only — pending + detail
│   └── api/restock-check/       # Cron-triggered restock endpoint
├── components/
│   ├── cards/                   # MetricCard
│   ├── emails/                  # React Email templates
│   ├── forms/                   # Client forms (signin, signup, add-product, variant-fields, etc.)
│   ├── modals/                  # Dialog components (OTP, order, detail, etc.)
│   ├── restock/                 # Restock request detail
│   ├── home/                    # Homepage sections (hero, features, workflow, roles)
│   ├── shared/                  # Container, Navbar, Footer, DataTable, Sidebar, SlugInput, ImageUpload
│   ├── tables/                  # Products, Orders, Customers, Categories, Restocks tables
│   └── ui/                      # 25 shadcn/ui primitives
├── hooks/                       # useUserData, use-mobile
├── lib/                         # Core utilities
│   ├── prisma.ts                # Singleton Prisma client
│   ├── token.ts                 # JWT generate/verify
│   ├── password.ts              # bcrypt hash/compare
│   ├── otp.ts                   # 6-digit OTP with bcrypt hashing
│   ├── email.tsx                # Nodemailer transporter + send
│   ├── slug.ts                  # generateSlug()/uniqueSlug()/SLUG_REGEX
│   ├── constants.ts             # Sidebar items, status config, token ages
│   ├── constants-server.ts      # Protected paths, cookie options (server-only)
│   ├── env.ts                   # Zod-validated env accessor
│   └── error.ts                 # Error response formatter
├── providers/                   # theme-provider, user-provider
├── schemas/                     # Zod schemas (env, user, product, category, order)
└── types/                       # TypeScript interfaces (user, order, product, category, restock, token)
```

---

## Database Models

| Model                  | Key Fields                                                                                                                                                                | Relations                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **User**               | id, email, password, role (USER/ADMIN), isVerified, isActive, verification/reset OTP fields, lastLoggedIn                                                                 | orders[], productVariants[](supplier), restockRequests[](stockedBy)                      |
| **Category**           | id, name, slug(unique), image                                                                                                                                             | products[]                                                                               |
| **Product**            | id, name, description, brand, tags(String[]), slug(unique), status(DRAFT/ACTIVE/ARCHIVED/OUT_OF_STOCK), isFeatured, categoryId                                            | category, images[](ProductImage), variants[](ProductVariant)                             |
| **ProductImage**       | id, url, altText, isPrimary, productId (cascade DELETE)                                                                                                                   | product                                                                                  |
| **ProductVariant**     | id, sku(unique, Char(12)), attributes(Json), stock, minThreshold(10), maxThreshold(100), costPrice, originalPrice, discountAmount/Type/Value, supplierId, lastRestockedAt | product(cascade), items[](OrderItem), restockItems[](RestockRequestItem), supplier(User) |
| **Order**              | id, orderNumber(unique), status(PENDING/CONFIRMED/SHIPPED/DELIVERED/CANCELLED), totalAmount(Decimal), userId, shippingAddress                                             | user, items[](OrderItem, cascade)                                                        |
| **OrderItem**          | id, orderId, productVariantId, quantity, unitPrice(Decimal)                                                                                                               | order(cascade), productVariant                                                           |
| **RestockRequest**     | id, status(PENDING/APPROVED/CANCELLED), stockedById, approvedAt, cancelledAt                                                                                              | stockedBy(User), items[](RestockRequestItem, cascade)                                    |
| **RestockRequestItem** | id, restockRequestId, productVariantId, quantity                                                                                                                          | productVariant, restockRequest(cascade)                                                  |

---

## Auth Flow

1. **Registration**: Zod validation → check duplicate → bcrypt hash → Cloudinary
   upload → create user → send welcome email + verification OTP
2. **Login**: Validate credentials → check verification → set JWT cookies
   (access 15m + refresh 7d) → return user
3. **Middleware** (`proxy.ts`): Protects `/dashboard/*` — auto-refreshes expired
   access tokens via refresh token; redirects unauthenticated users to
   `/auth/signin`
4. **Server Action Guard** (`isAuthenticated`): Reads access token from cookie,
   verifies, auto-refreshes if expired
5. **Email Verification**: 6-digit OTP, bcrypt-hashed, 10min expiry, max 5
   attempts
6. **Password Reset**: Two-stage — request OTP → verify OTP → set new password

---

## Homepage

The public route `/` renders a marketing landing page (no redirect to
dashboard).

- **Layout**: `Navbar` → `Hero` → Features → Workflow → Roles → `Footer`
- **Auth-aware CTAs**: `isAuthenticated()` (JWT from httpOnly cookies) drives
  Sign In / Dashboard links in the navbar and hero, wrapped in `Suspense` for
  Partial Prerendering with Cache Components
- **Components**: `components/shared/navbar.tsx`, `footer.tsx`; section blocks
  under `components/home/`

---

## Key Flows

### Products & Variants

- Admin creates products via `/dashboard/add-products` and edits/extends them via
  `/dashboard/edit-product/[id]` (pencil action in the products table)
- A product supports **multiple variants** — each with its own unique SKU, stock,
  min/max thresholds, cost/selling prices, discount, and structured attribute
  key/value rows (serialized to the `attributes` Json column)
- **Images**: multiple per product (min 1, first is primary); uploaded via
  Cloudinary `ImageUpload` with instant preview, replaced wholesale on edit
- Removed variants are **deactivated** (`isActive = false`), never hard-deleted,
  so orders and restock history remain intact
- Slugs are optional in forms and auto-generated from the name via
  `generateSlug()` (fallback `uniqueSlug()` on collision)
- SKU conflicts are pre-checked against the DB for friendly errors

### Orders

- Created via `createOrder` server action inside a Prisma `$transaction`
- Validates stock, deducts inventory atomically with order creation
- Status lifecycle: PENDING → CONFIRMED → SHIPPED → DELIVERED (admin-managed)
- Users can delete only their own PENDING orders; admins can delete any

### Restock

- **Automated**: Vercel cron (`0 0 * * *`) hits `/api/restock-check` — creates
  `RestockRequest` for variants where `stock <= minThreshold` (product `ACTIVE`)
- **Manual Approval**: Admin views pending requests, can adjust quantities, then
  approves (increments variant stock, sets `lastRestockedAt`) or cancels
- Variants already in a pending restock request are excluded from new
  auto-generated requests

### Email

- Gmail OAuth2 via Nodemailer
- Templates rendered as React Email components
- Triggers: registration (welcome + verification OTP), login when unverified
  (resend OTP), forgot password (reset OTP)
- Email failures are caught and logged but do not block the request

---

## Environment Variables

| Variable                            | Required | Description                                   |
| ----------------------------------- | -------- | --------------------------------------------- |
| `DATABASE_URL`                      | Yes      | PostgreSQL connection string (postgres://...) |
| `ACCESS_TOKEN_SECRET`               | Yes      | JWT secret for access tokens (min 32 chars)   |
| `REFRESH_TOKEN_SECRET`              | Yes      | JWT secret for refresh tokens (min 32 chars)  |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Yes      | Cloudinary cloud name                         |
| `CLOUDINARY_API_KEY`                | Yes      | Cloudinary API key (15 chars)                 |
| `CLOUDINARY_API_SECRET`             | Yes      | Cloudinary API secret                         |
| `NEXT_PUBLIC_SITE_URL`              | Yes      | Site URL for callbacks                        |
| `GOOGLE_CLIENT_ID`                  | Yes      | Gmail OAuth2 client ID                        |
| `GOOGLE_CLIENT_SECRET`              | Yes      | Gmail OAuth2 client secret                    |
| `GOOGLE_REFRESH_TOKEN`              | Yes      | Gmail OAuth2 refresh token                    |
| `EMAIL_FROM_NAME`                   | Yes      | Sender display name                           |
| `EMAIL_FROM`                        | Yes      | Sender email address                          |
| `NODE_ENV`                          | Yes      | development / production / test               |
| `CRON_SECRET`                       | No       | Bearer token for restock-check API            |
| `NEXT_PUBLIC_DEMO_EMAIL`            | No       | Demo login email                              |
| `NEXT_PUBLIC_DEMO_PASSWORD`         | No       | Demo login password                           |

---

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run clean        # Clean build artifacts
npm run db:seed      # Seed 10 categories + 20 products (idempotent)
npx prisma migrate deploy  # Apply migrations
npx prisma generate        # Regenerate Prisma client
```

---

## Coding Conventions

- **No comments** in code unless necessary for public API documentation
- Server Actions return `{ success: boolean, message: string, ... }` objects
- All forms use react-hook-form with Zod resolver
- Path alias `@/` maps to `src/`
- Mutations call `revalidatePath()` to invalidate Next.js caches
- Slugs rely on `generateSlug()`/`uniqueSlug()` (never hand-written) and are
  validated by `SLUG_REGEX`
- Always prefer editing existing files over creating new ones
- Match existing patterns (import style, component structure, naming
  conventions)
