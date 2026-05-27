# Snap Order

Modern inventory and order management dashboard for customers and
administrators.

Live: https://snap-order-sigma.vercel.app/

## Overview

Snap Order is a full-stack Next.js application built with TypeScript, Prisma,
and PostgreSQL. It supports role-based access for end users and admins, secure
email verification, order management, and inventory workflows.

## Features

- Authentication: registration, login, email verification, password reset
- Role-based access: `USER` and `ADMIN`
- Customer dashboard: order history, available products, profile management
- Admin dashboard: product catalog, customer list, pending restock approvals,
  order status management
- Inventory controls: stock levels, min/max thresholds, product lifecycle
- Order processing: line-item orders, stock deduction, order status updates
- Restock workflow: pending requests, approval, and cancellation
- Email notifications via Gmail OAuth

## Database Design

- `User`: email, password, role, verification state, reset token fields, last
  login
- `Product`: name, description, price, stock, min/max thresholds, supplier
  relation
- `Order`: order number, status, total amount, shipping address, customer
  relation
- `OrderItem`: order line items, quantity, unit price
- `RestockRequest`: pending/approved/cancelled status, stocked-by admin,
  timestamps
- `RestockRequestItem`: requested product quantity per restock request

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Cloudinary
- Nodemailer with Gmail OAuth
- Zod validation
- shadcn/ui components

## Setup

1. Install dependencies

```bash
npm install
```

2. Add environment variables

Required variables:

- `NODE_ENV`
- `DATABASE_URL`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `EMAIL_FROM_NAME`
- `EMAIL_FROM`

3. Apply database migrations

```bash
npx prisma migrate deploy
```

4. Start development server

```bash
npm run dev
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run clean`

## Contact

Md. Rakibul Islam

Email: rakibul00206@gmail.com

WhatsApp: +8801888419206
