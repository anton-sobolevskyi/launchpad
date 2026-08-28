import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

// A separate, edge-safe NextAuth instance built from the shared config,
// deliberately NOT importing from "@/auth" (which pulls in Prisma and
// bcrypt — both unsupported on the Edge runtime middleware runs on).
// Reading/verifying the JWT session cookie doesn't need the database,
// so this lighter instance is all middleware requires.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  if (!isLoggedIn) {
    const loginUrl = new URL("/auth/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/submit"],
};
