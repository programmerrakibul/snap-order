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
prisma/                          # Schema + migrations
src/
├── proxy.ts                     # Next.js middleware — auth guard + token refresh
├── actions/server/              # Server Actions (data mutations)
│   ├── user.action.ts           # Auth, profile, verification, password reset
│   ├── product.action.ts        # Product CRUD (create/read only)
│   ├── order.action.ts          # Order CRUD + status management
│   ├── restock.action.ts        # Restock approve/cancel
│   ├── overview.action.ts       # Dashboard stats
│   ├── cookie.ts                # JWT cookie helpers
│   ├── getAccessToken.ts        # Read access token from cookie
│   ├── isAuthenticated.ts       # Auth check with auto-refresh
│   ├── refreshToken.ts          # Token refresh logic
│   └── uploadToCloudinary.ts    # Image upload helper
├── app/                         # Next.js App Router pages
│   ├── auth/                    # signin, signup, forgot-password
│   ├── dashboard/               # Protected pages
│   │   ├── layout.tsx           # Sidebar + SiteHeader + UserProvider
│   │   ├── _component/          # admin-overview, user-overview
│   │   ├── add-products/        # Admin only
│   │   ├── products/            # Product listing
│   │   ├── orders/              # Order listing
│   │   ├── customers/           # Admin only
│   │   ├── profile/             # User profile
│   │   └── restock-products/    # Admin only — pending + detail
│   └── api/restock-check/       # Cron-triggered restock endpoint
├── components/
│   ├── cards/                   # MetricCard
│   ├── emails/                  # React Email templates
│   ├── forms/                   # Client forms (signin, signup, add-product, etc.)
│   ├── modals/                  # Dialog components (OTP, order, detail, etc.)
│   ├── restock/                 # Restock request detail
│   ├── shared/                  # Container, DataTable, Sidebar, Header, etc.
│   ├── tables/                  # Products, Orders, Customers, Restocks tables
│   └── ui/                      # 25 shadcn/ui primitives
├── hooks/                       # useUserData, use-mobile
├── lib/                         # Core utilities
│   ├── prisma.ts                # Singleton Prisma client
│   ├── token.ts                 # JWT generate/verify
│   ├── password.ts              # bcrypt hash/compare
│   ├── otp.ts                   # 6-digit OTP with bcrypt hashing
│   ├── email.tsx                # Nodemailer transporter + send
│   ├── constants.ts             # Sidebar items, status config, token ages
│   ├── constants-server.ts      # Protected paths, cookie options (server-only)
│   ├── env.ts                   # Zod-validated env accessor
│   └── error.ts                 # Error response formatter
├── providers/                   # theme-provider, user-provider
├── schemas/                     # Zod schemas (env, user, product, order)
└── types/                       # TypeScript interfaces (user, order, product, restock, token)
```

---

## Database Models

| Model                  | Key Fields                                                                                                                       | Relations                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **User**               | id, email, password, role (USER/ADMIN), isVerified, isActive, verificationCode, resetPasswordCode, lastLoggedIn                  | orders[], products[](supplier), restockRequests[](stockedBy) |
| **Product**            | id, name(unique), description, price(Decimal), stock, minThreshold(10), maxThreshold(100), supplierId, isActive, lastRestockedAt | orderItems[], restockItems[], supplier(User)                 |
| **Order**              | id, orderNumber(unique), status(PENDING/CONFIRMED/SHIPPED/DELIVERED/CANCELLED), totalAmount(Decimal), userId, shippingAddress    | user, items[](OrderItem, cascade)                            |
| **OrderItem**          | id, orderId, productId, quantity, unitPrice(Decimal)                                                                             | order(cascade), product                                      |
| **RestockRequest**     | id, status(PENDING/APPROVED/CANCELLED), stockedById, approvedAt, cancelledAt                                                     | stockedBy(User), items[](RestockRequestItem, cascade)        |
| **RestockRequestItem** | id, restockRequestId, productId, quantity                                                                                        | product, restockRequest(cascade)                             |

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

## Key Flows

### Orders

- Created via `createOrder` server action inside a Prisma `$transaction`
- Validates stock, deducts inventory atomically with order creation
- Status lifecycle: PENDING → CONFIRMED → SHIPPED → DELIVERED (admin-managed)
- Users can delete only their own PENDING orders; admins can delete any

### Restock

- **Automated**: Vercel cron (`0 0 * * *`) hits `/api/restock-check` — creates
  `RestockRequest` for products where `stock <= minThreshold`
- **Manual Approval**: Admin views pending requests, can adjust quantities, then
  approves (increments stock, sets `lastRestockedAt`) or cancels
- Products already in a pending restock request are excluded from new
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
- Always prefer editing existing files over creating new ones
- Match existing patterns (import style, component structure, naming
  conventions)
