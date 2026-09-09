# Launchpad

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://launchpad-bay-kappa.vercel.app)

Product Hunt-style launch platform built as a deliberate showcase of **Next.js 15 App Router** features.

**Live:** [launchpad-bay-kappa.vercel.app](https://launchpad-bay-kappa.vercel.app)

## Goals / Purpose

Portfolio project built to demonstrate full-stack Next.js skills relevant to job applications:

- Modern App Router patterns in a realistic product (not a toy todo app)
- ISR, parallel/intercepting routes, Server Actions, streaming, and middleware
- Auth, PostgreSQL + Prisma, and optional AI (tagline suggestions)
- Deployed on Vercel end-to-end

## Features

- Product feed ranked by upvotes with launch-state indicators
- Product detail pages with comments and optimistic upvotes
- Submit new products (with optional AI tagline suggestions)
- Search with streamed results
- Maker dashboard (submissions, analytics, settings)
- Credentials auth via Auth.js v5

## Tech Stack

| Layer        | Technology                    |
|--------------|-------------------------------|
| Framework    | Next.js 15 (App Router)       |
| UI           | React 19, Tailwind CSS        |
| Database     | PostgreSQL + Prisma           |
| Auth         | Auth.js v5 (Credentials)      |
| AI           | Vercel AI SDK + OpenRouter    |
| Deploy       | Vercel                        |
| Language     | TypeScript                    |

## Architecture Highlights

- **ISR** on the homepage feed (revalidate every 60s)
- **SSR + `generateMetadata`** and dynamic OG images (`next/og`)
- **Parallel + intercepting routes** for product modal vs full page
- **Parallel routes** on `/dashboard` (`@submissions`, `@analytics`, `@settings`)
- **Server Actions** for upvote, submit, comments (no client API layer)
- **`useOptimistic`** for instant upvote/comment UI
- **Suspense streaming** on search; middleware guards for `/dashboard` and `/submit`
- **AI SDK streaming** for “Suggest tagline” on submit

## Project Structure

```
src/
  auth.ts                       # Auth.js v5 (Credentials)
  lib/db.ts                     # Prisma client singleton
  app/
    layout.tsx                  # root layout + @modal slot
    page.tsx                    # ISR feed (homepage)
    @modal/(.)products/[slug]/ # intercepted quick-view modal
    products/[slug]/           # full SSR page, OG image, error.tsx
    search/                     # Suspense + streamed results
    submit/                     # Server Action form + AI suggester
    dashboard/                  # parallel slots
    auth/login/
    api/
      auth/[...nextauth]/
      suggest-tagline/          # AI streaming
      search/
    actions.ts                  # all Server Actions
  components/
    StatusStrip.tsx             # launch-state indicator
    ProductCard / ProductDetail
    UpvoteButton / CommentSection  # useOptimistic
    SubmitForm / TaglineSuggester
    Modal / Nav
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL (local, Neon, Supabase, or Railway)

### Installation

```bash
git clone https://github.com/anton-sobolevskyi/launchpad.git
cd launchpad
npm install
cp .env.example .env
```

### Environment

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Postgres connection string |
| `AUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `OPENROUTER_API_KEY` | Optional — AI tagline suggestions on `/submit` |
| `NEXT_PUBLIC_APP_URL` | App URL (default `http://localhost:3000`) |

### Development

```bash
npx prisma db push     # create tables
npm run db:seed        # demo data (2 users, 3 products)
npm run dev
# → http://localhost:3000
```

**Demo login:** `alice@example.com` / `password123`

### Build

```bash
npm run build
npm start
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run db:seed` | Seed database |
| `npm run db:migrate` | Prisma migrate |
| `npm run lint` | Lint |

## Key Implementation Details

### Showcase map

| Pattern | Location |
|---------|----------|
| ISR | `src/app/page.tsx` |
| SSR + metadata | `src/app/products/[slug]/page.tsx` |
| Dynamic OG | `src/app/products/[slug]/opengraph-image.tsx` |
| Intercepting modal | `src/app/@modal/(.)products/[slug]` |
| Parallel dashboard | `src/app/dashboard/@*` |
| Server Actions | `src/app/actions.ts` |
| AI streaming | `src/app/api/suggest-tagline/route.ts` |

### Data model

- **User** — email, password hash, name
- **Product** — slug, name, tagline, description, website, launch time, creator
- **Upvote** — unique per user + product
- **Comment** — content, author, product

## Roadmap / Next steps

- Pagination on feed and search
- Real “schedule a launch” flow
- `robots.txt` / `sitemap.ts` for product pages
- Social login (Google, GitHub)

## License

Portfolio project. Free to use for learning purposes.
