import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextFetchEvent, type NextMiddleware, type NextRequest } from "next/server";
import { routing } from "../i18n/routing";
import { auth } from "@/lib/auth";

const intlMiddleware = createMiddleware(routing);

const ADMIN_PREFIX = "/admin";
const ADMIN_API_PREFIX = "/api/admin";

/** Segment-aware prefix test. `startsWith("/admin")` would also match `/administrator`. */
function isUnder(pathname: string, prefix: string): boolean {
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

const adminMiddleware = auth((req) => {
    const pathname = req.nextUrl.pathname;
    const isLoginPage = pathname === `${ADMIN_PREFIX}/login`;
    const isAdminApi = isUnder(pathname, ADMIN_API_PREFIX);

    // An explicit user-id test rather than `!!req.auth`. Auth.js populates the
    // auth object with an error on configuration failure, and a truthy check
    // would fail open on exactly that path.
    const userId = req.auth?.user?.id;
    const isAuthenticated = typeof userId === "string" && userId.length > 0;

    if (isLoginPage) {
        return isAuthenticated ? NextResponse.redirect(new URL(ADMIN_PREFIX, req.url)) : NextResponse.next();
    }

    if (!isAuthenticated) {
        if (isAdminApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        return NextResponse.redirect(new URL(`${ADMIN_PREFIX}/login`, req.url));
    }

    return NextResponse.next();
}) as unknown as (req: NextRequest, event: NextFetchEvent) => ReturnType<NextMiddleware>;

/**
 * next-intl answers a bare "/" with 307, which means "this move is temporary".
 * The locale prefix on a canonical URL never stops being correct, and crawlers
 * read 307 and 308 as temporary, so the ranking signal does not consolidate the
 * way it does for a 301. A client that does not follow temporary redirects
 * simply gets an empty body from the site root, which is what a crawler
 * fetching "/" reports as an unreadable page.
 */
function asPermanentRedirect(response: NextResponse): NextResponse {
    if (response.status !== 307) return response;

    // The set-cookie header is carried separately from the header list, so it
    // is lifted out and re-applied rather than copied, to avoid emitting the
    // locale cookie twice.
    const cookies = response.cookies.getAll();
    const headers = new Headers(response.headers);
    headers.delete("set-cookie");

    const permanent = new NextResponse(response.body, { status: 308, headers });
    cookies.forEach((cookie) => permanent.cookies.set(cookie));

    return permanent;
}

export function proxy(req: NextRequest, event: NextFetchEvent) {
    const { pathname } = req.nextUrl;

    if (isUnder(pathname, ADMIN_PREFIX) || isUnder(pathname, ADMIN_API_PREFIX)) {
        return adminMiddleware(req, event);
    }

    if (isUnder(pathname, "/design-system")) {
        return NextResponse.next();
    }

    return asPermanentRedirect(intlMiddleware(req));
}

export const config = {
    /**
     * First pattern: every page route except API, framework internals and
     * anything with a file extension (sitemap.xml, favicon.ico, icon.svg).
     * Second pattern: re-admits the admin API so it gets a 401 JSON response
     * instead of an HTML redirect.
     *
     * The admin API is additionally authorised inside every handler via
     * requireAdmin(); this matcher is a routing convenience, not the control.
     */
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/api/admin/:path*"],
};
