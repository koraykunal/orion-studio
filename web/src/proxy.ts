import createMiddleware from 'next-intl/middleware';
import { routing } from '../i18n/routing';
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export const proxy = auth((req) => {
  const pathname = req.nextUrl.pathname;
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (isAdmin) {
    const isLoginPage = pathname === "/admin/login";
    const isApiAdmin = pathname.startsWith("/api/admin");
    const isAuthenticated = !!req.auth;

    if (isLoginPage && isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (!isLoginPage && !isAuthenticated) {
      if (isApiAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  return intlMiddleware(req as NextRequest);
});

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)', '/api/admin/:path*'],
};
