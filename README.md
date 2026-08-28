# Launchpad

A Product Hunt-style launch platform, built as a deliberate showcase of
Next.js 15 App Router features — not just React with routing bolted on.

## What this demonstrates

| Feature | Where |
|---|---|
| **ISR** (Incremental Static Regeneration) | `/` — the feed revalidates every 60s (`src/app/page.tsx`) |
| **SSR + dynamic metadata** | `/products/[slug]` — `generateMetadata` per product |
| **Dynamic OG images** | `src/app/products/[slug]/opengraph-image.tsx` via `next/og` |
| **Parallel + intercepting routes** | Clicking a product from the feed opens a modal (`src/app/@modal/(.)products/[slug]`); a direct visit or refresh renders the full page instead |
| **Parallel routes (dashboard)** | `/dashboard` loads `@submissions`, `@analytics`, `@settings` as independent streams |
| **Server Actions** | Upvoting, submitting products, posting comments — no client-side API calls (`src/app/actions.ts`) |
| **`useOptimistic`** | Upvote button and comment posting update instantly, before the server responds |
| **Route Handlers + Suspense streaming** | `/search` streams DB results in via `<Suspense>` (`src/app/search/`) |
| **Middleware** | Route-guards `/dashboard` and `/submit` (`middleware.ts`) |
| **AI SDK streaming** | "Suggest tagline" on `/submit` streams a suggestion from an LLM (`src/app/api/suggest-tagline/route.ts`) |
| **loading.tsx / error.tsx conventions** | `src/app/loading.tsx`, `src/app/products/[slug]/error.tsx` |

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:
- `DATABASE_URL` — a Postgres connection string (Neon, Supabase, Railway, or local Postgres all work)
- `AUTH_SECRET` — generate with `openssl rand -base64 32`
- `OPENROUTER_API_KEY` — optional; without it, the tagline-suggestion feature shows a graceful "not configured" message instead of erroring

Then:

```bash
npx prisma db push     # create tables from prisma/schema.prisma
npx prisma db seed     # load demo data (2 users, 3 products)
npm run dev
```

Demo login: `alice@example.com` / `password123`

## A note on how this was built

This scaffold was built and reviewed in a sandboxed environment without
network access to Prisma's engine-binary host or Google Fonts — so two
things couldn't be fully verified end-to-end here and are worth double
checking the first time you run it for real:

1. **Prisma Client types.** `npx prisma generate` (triggered automatically
   by `npm install`) needs to download a query-engine binary. In a normal
   environment with internet access this "just works" — but if you ever
   see `Prisma.ProductGetPayload` type errors, run `npx prisma generate`
   manually and confirm it completes without a 403/network error.
2. **`next/font/google`** downloads Space Grotesk, Inter, and JetBrains
   Mono at build time. Same story — works out of the box with normal
   internet access.

Everything else — the full route tree, the parallel/intercepting route
structure for the modal, Server Actions, and the webpack build itself —
was verified directly with `next build`.

## Project structure

```
src/
  auth.ts                       # Auth.js v5 config (Credentials provider)
  lib/db.ts                     # Prisma client singleton
  app/
    layout.tsx                  # root layout incl. @modal slot
    page.tsx                    # ISR feed (this IS the homepage)
    @modal/
      default.tsx
      (.)products/[slug]/page.tsx   # intercepted quick-view modal
    products/[slug]/
      page.tsx                  # full SSR page
      opengraph-image.tsx       # dynamic OG image
      error.tsx
    search/
      page.tsx                  # Suspense boundary
      results.tsx                # streamed server component
    submit/page.tsx              # Server Action form + AI tagline suggester
    dashboard/
      layout.tsx                 # composes 3 parallel slots
      @submissions/ @analytics/ @settings/
    auth/login/page.tsx
    api/
      auth/[...nextauth]/route.ts
      suggest-tagline/route.ts   # AI SDK streaming
      search/route.ts
    actions.ts                   # all Server Actions
  components/
    StatusStrip.tsx              # signature "mission control" launch-state indicator
    ProductCard.tsx / ProductDetail.tsx
    UpvoteButton.tsx / CommentSection.tsx  # useOptimistic
    SubmitForm.tsx / TaglineSuggester.tsx
    Modal.tsx / Nav.tsx
```

## Natural next steps

- Deploy to Vercel (this app is built with Vercel's platform in mind —
  Edge runtime for the OG image and AI routes, ISR, ImageResponse)
- Add pagination to the feed and search
- Swap the launch-window countdown for a real "schedule a launch" flow
- Add a `robots.txt` / `sitemap.ts` for the product pages (good SSR/SEO showcase addition)
