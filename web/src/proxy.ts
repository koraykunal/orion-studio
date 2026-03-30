import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isApiAdmin = req.nextUrl.pathname.startsWith("/api/admin");
  const isAuthenticated = !!req.auth;

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (isAdminRoute && !isLoginPage && !isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (isApiAdmin && !isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
