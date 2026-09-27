import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Readiness probe for the container HEALTHCHECK and for `depends_on:
 * condition: service_healthy` in docker-compose.
 *
 * It reports unhealthy when the database is unreachable, which is the point:
 * a process that is listening but cannot serve content is not ready, and
 * routing traffic to it turns a database blip into a site outage.
 *
 * Public and unauthenticated by necessity, so it returns no detail beyond a
 * boolean. Never expose version numbers, hostnames or error text here.
 */
export async function GET() {
    const startedAt = Date.now();

    try {
        await prisma.$queryRaw`SELECT 1`;
    } catch {
        return NextResponse.json(
            { status: "unhealthy", database: "unreachable" },
            { status: 503, headers: { "Cache-Control": "no-store" } },
        );
    }

    return NextResponse.json(
        { status: "ok", database: "reachable", latencyMs: Date.now() - startedAt },
        { status: 200, headers: { "Cache-Control": "no-store" } },
    );
}
