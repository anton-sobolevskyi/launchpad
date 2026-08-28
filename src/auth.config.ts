import type { NextAuthConfig } from "next-auth";

// This config is intentionally free of Node-only dependencies (Prisma,
// bcrypt) so it can be imported by middleware.ts, which runs on the Edge
// runtime. The Credentials provider (which needs Prisma + bcrypt to check
// a password against the database) is added separately in src/auth.ts,
// which only ever runs in Node contexts (Server Components, Server
// Actions, Route Handlers) — never in middleware.
export const authConfig = {
  pages: { signIn: "/auth/login" },
  session: { strategy: "jwt" },
  providers: [], // populated in src/auth.ts
} satisfies NextAuthConfig;
