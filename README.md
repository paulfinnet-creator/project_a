# Naija Adventure Tours

A booking platform for a Nigeria-based tour operator. Tourists can browse tour packages,
register an account, book a tour, and pay with cryptocurrency. Admins get a dashboard to manage
tour packages, bookings, and registered tourists.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** with a custom UI kit (Button, Card, Input, Table, etc.)
- **Prisma 6** + SQLite for local development (swap to Postgres for production — see below)
- **Auth.js v5** (NextAuth) with credentials login, role-based access (`ADMIN` / `TOURIST`)
- **Cryptocurrency payments** via [NOWPayments](https://nowpayments.io), behind a pluggable
  `PaymentProvider` interface so other providers (Paystack, Flutterwave, cards, ...) can be added
  later without touching booking logic

## Getting Started

```bash
npm install
npm run db:seed   # creates the admin user + 5 sample tour packages
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seeded accounts

The seed script (`prisma/seed.ts`) creates one admin account, using the credentials from `.env`:

- Email: `ADMIN_SEED_EMAIL` (default `admin@naijaadventuretours.com`)
- Password: `ADMIN_SEED_PASSWORD` (default `ChangeMe123!`)

**Change these in `.env` before deploying anywhere public.**

Tourist accounts are created by visiting `/register`.

## Payments

No real payment credentials are required for local development. When `NOWPAYMENTS_API_KEY` is
not set, the app automatically uses a built-in **Mock payment provider** — the full booking flow
(create booking → pay → webhook-equivalent confirmation → dashboard) works end-to-end with a
"Simulate Payment" button instead of a real crypto charge.

To accept real crypto payments:

1. Create a [NOWPayments](https://nowpayments.io) account and get an API key + IPN secret.
2. Set `NOWPAYMENTS_API_KEY` and `NOWPAYMENTS_IPN_SECRET` in your production environment.
3. Set `NEXTAUTH_URL` to your real domain (used to build the IPN callback/success/cancel URLs).

That's it — no code changes needed. The app picks the provider automatically based on whether
`NOWPAYMENTS_API_KEY` is set (`src/lib/payments/index.ts`).

### Adding another payment method later

Implement the `PaymentProvider` interface in `src/lib/payments/types.ts` (see
`src/lib/payments/nowpayments.ts` for reference), register it in
`src/lib/payments/index.ts`, and add a webhook route under
`src/app/api/payments/webhook/[provider]/route.ts` (already generic — it dispatches by provider
name in the URL).

## Database

Local development uses SQLite (`prisma/dev.db`, zero setup). For production:

1. Provision a Postgres database.
2. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"   // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
3. Set `DATABASE_URL` to your Postgres connection string.
4. Run `npx prisma migrate deploy` (instead of `migrate dev`).

No application code depends on SQLite-specific behavior.

## Project structure

```
prisma/schema.prisma          Data model (User, TourPackage, Booking, Payment, ContactMessage)
prisma/seed.ts                 Seed script (admin user + sample packages)
src/auth.ts / auth.config.ts   Auth.js configuration (split for Edge-safe middleware)
src/middleware.ts / proxy.ts   Route protection (renamed to proxy.ts per Next.js 16 convention)
src/lib/payments/              Pluggable payment provider abstraction
src/lib/actions/               Server actions (forms, bookings, admin mutations)
src/app/(public pages)         Home, Packages, About, Contact, Register, Login
src/app/booking/[id]/...       Payment + confirmation pages
src/app/dashboard              Tourist "My Bookings" dashboard
src/app/admin/                 Admin dashboard (overview, bookings, tourists, package CRUD)
```

## Environment variables

See `.env.example`. Required for local dev: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`.
Everything else has a working default (Mock payments) or is optional.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run db:seed` — (re)seed the database
