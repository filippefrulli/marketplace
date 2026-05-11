---
name: Project stack and architecture
description: Tech stack, versions, and architectural decisions for the EU arts & crafts marketplace
type: project
---

EU arts & crafts marketplace (Etsy competitor). MVP-first, solid foundations for scale.

**Stack (versions as of 2026-05-11):**
- Next.js 16.2.6, React 19, TypeScript 5.9 (^5 range in package.json)
- Tailwind CSS 4, shadcn/ui (to be initialized)
- Supabase (auth + storage + PostgreSQL) — @supabase/supabase-js 2.105.4, @supabase/ssr 0.10.3
- Prisma 7.8.0 with `prisma-client` generator (NOT the old `prisma-client-js`) — uses adapter pattern via @prisma/adapter-pg + pg 8.20.0
- Stripe 22.1.1, API version `2026-04-22.dahlia` (Stripe Connect for marketplace payments)
- @tanstack/react-query 5, zustand 5, zod 4
- Meilisearch 0.58.0 for search

**Key architectural decisions:**
- Auth via Supabase Auth directly (not NextAuth — v5 still in beta as of scaffold date)
- Prisma 7 requires adapter pattern: `new PrismaClient({ adapter: new PrismaPg({...}) })`
- Prisma generated client at `src/generated/prisma/client.ts` (import path: `@/generated/prisma/client`)
- Route groups: `(marketplace)` public, `(auth)` login/register, `(seller)` dashboard, `(buyer)` account
- Prices stored as integers (cents) in the DB — `formatPrice()` utility in `src/lib/utils.ts`
- Stripe webhook handler at `src/app/api/webhooks/stripe/route.ts` (excluded from middleware matcher)
- `src/env.ts` validates all env vars at startup via @t3-oss/env-nextjs

**Database schema models:** User, SellerProfile, Category, Listing, ListingImage, Address, Order, OrderItem, Review

**Why:** Competing with Etsy in EU arts & craft marketplace space. EU-specific: VAT via Stripe Tax, GDPR consent needed, i18n from day one (i18next 26 + react-i18next 17).
