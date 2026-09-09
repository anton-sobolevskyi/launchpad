# Launchpad

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://launchpad-bay-kappa.vercel.app)

A Product Hunt-style launch platform, built as a deliberate showcase of **Next.js 15 App Router** features — not just React with routing bolted on.

**Live:** [launchpad-bay-kappa.vercel.app](https://launchpad-bay-kappa.vercel.app)

## Features

- Product feed ranked by upvotes with launch-state indicators
- Product detail pages with comments and optimistic upvotes
- Submit new products (with AI-powered tagline suggestions)
- Search with streaming results
- Maker dashboard (submissions, analytics, settings)
- Auth (credentials) via Auth.js v5

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
| **Route Handlers + Suspense streaming** | `/search` streams DB results via `<Suspense>` (`src/app/search/`) |
| **Middleware** | Route-guards `/dashboard` and `/submit` (`middleware.ts`) |
| **AI SDK streaming** | "Suggest tagline" on `/submit` streams a suggestion from an LLM (`src/app/api/suggest-tagline/route.ts`) |
| **loading.tsx / error.tsx conventions** | `src/app/loading.tsx`, `src/app/products/[slug]/error.tsx` |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS |
| Database | PostgreSQL + Prisma |
| Auth | Auth.js v5 (Credentials) |
| AI | Vercel AI SDK + OpenRouter |
| Language | TypeScript |

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string (Neon, Supabase, Railway, or local) |
| `AUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `OPENROUTER_API_KEY` | Optional — enables AI tagline suggestions on `/submit` |
| `NEXT_PUBLIC_APP_URL` | App URL (default `http://localhost:3000`) |

Then:

```bash
npx prisma db push     # create tables from prisma/schema.prisma
npm run db:seed        # load demo data (2 users, 3 products)
npm run dev
```

**Demo login:** `alice@example.com` / `password123`

## Project structure

```
src/
  auth.ts                       # Auth.js v5 config (Credentials provider)
  lib/db.ts                     # Prisma client singleton
  app/
    layout.tsx                  # root layout incl. @modal slot
    page.tsx                    # ISR feed (homepage)
    @modal/
      default.tsx
      (.)products/[slug]/page.tsx   # intercepted quick-view modal
    products/[slug]/
      page.tsx                  # full SSR page
      opengraph-image.tsx       # dynamic OG image
      error.tsx
    search/
      page.tsx                  # Suspense boundary
      results.tsx               # streamed server component
    submit/page.tsx             # Server Action form + AI tagline suggester
    dashboard/
      layout.tsx                # composes 3 parallel slots
      @submissions/ @analytics/ @settings/
    auth/login/page.tsx
    api/
      auth/[...nextauth]/route.ts
      suggest-tagline/route.ts  # AI SDK streaming
      search/route.ts
    actions.ts                  # all Server Actions
  components/
    StatusStrip.tsx             # launch-state indicator
    ProductCard.tsx / ProductDetail.tsx
    UpvoteButton.tsx / CommentSection.tsx  # useOptimistic
    SubmitForm.tsx / TaglineSuggester.tsx
    Modal.tsx / Nav.tsx
```

## Data model

- **User** — email, password hash, name
- **Product** — slug, name, tagline, description, website, launch time, creator
- **Upvote** — unique per user + product
- **Comment** — content, author, product

## Natural next steps

- Add pagination to the feed and search
- Swap the launch-window countdown for a real "schedule a launch" flow
- Add `robots.txt` / `sitemap.ts` for product pages (SSR/SEO showcase)
- Social login providers (Google, GitHub)

## License

Personal project. Free to use for learning purposes.
