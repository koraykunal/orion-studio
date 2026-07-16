import createMiddleware from 'next-intl/middleware';
import { routing } from '../i18n/routing';
import { auth } from "@/lib/auth";
import { NextResponse, type NextFetchEvent, type NextMiddleware, type NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

const adminMiddleware = auth((req) => {
  const pathname = req.nextUrl.pathname;
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
}) as unknown as (req: NextRequest, event: NextFetchEvent) => ReturnType<NextMiddleware>;

export function proxy(req: NextRequest, event: NextFetchEvent) {
  const pathname = req.nextUrl.pathname;
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (isAdmin) return adminMiddleware(req, event);

  if (pathname === "/design-system" || pathname.startsWith("/design-system/")) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/api/admin/:path*'],
};
