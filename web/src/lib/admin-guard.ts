import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export type AdminSession = { userId: string };

/**
 * Authorises an admin API request.
 *
 * Every `/api/admin/*` handler calls this. `src/proxy.ts` already gates these
 * paths, but a single matcher is a single point of failure: change the prefix,
 * add a route outside it, or move the app behind a different entry point, and
 * the whole CMS including contact-message PII is open. The proxy is defence in
 * depth, this is the actual check.
 *
 * Returns the session on success and a ready-to-return 401 response on failure.
 */
export async function requireAdmin(): Promise<{ session: AdminSession; failure: null } | { session: null; failure: NextResponse }> {
    const authSession = await auth();
    const userId = authSession?.user?.id;

    // Deliberately an explicit user-id check rather than `!!session`, so a
    // malformed or error-populated session object can never satisfy this.
    if (typeof userId !== "string" || userId.length === 0) {
        return {
            session: null,
            failure: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    return { session: { userId }, failure: null };
}
