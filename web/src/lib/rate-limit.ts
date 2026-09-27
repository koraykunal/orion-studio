import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

export type RateLimitOptions = {
    key: string;
    windowMs: number;
    max: number;
};

export type RateLimitResult = {
    allowed: boolean;
    remaining: number;
    retryAfterMs: number;
    /** Echoed back as X-RateLimit-Limit so clients can self-throttle. */
    max: number;
};

function hashKey(key: string): string {
    return createHash("sha256").update(key).digest("hex");
}

/**
 * Buckets are only ever read when their window is active, so expired rows are
 * pure garbage. A full scan per request would be wasteful, so cleanup runs
 * opportunistically on roughly one call in fifty. This keeps the table bounded
 * without needing a cron job or a separate worker.
 */
let requestsSinceCleanup = 0;
const CLEANUP_EVERY = 50;

async function sweepExpiredBuckets(now: Date): Promise<void> {
    requestsSinceCleanup += 1;
    if (requestsSinceCleanup % CLEANUP_EVERY !== 0) return;
    try {
        await prisma.rateLimitBucket.deleteMany({ where: { resetAt: { lt: now } } });
    } catch (error) {
        // Never let maintenance turn a rate-limit check into a request failure.
        console.error("Rate limit bucket sweep failed:", error);
    }
}

export async function rateLimit({ key, windowMs, max }: RateLimitOptions): Promise<RateLimitResult> {
    const now = new Date();
    const resetAt = new Date(now.getTime() + windowMs);
    const storedKey = hashKey(key);

    void sweepExpiredBuckets(now);

    return prisma.$transaction(async (tx) => {
        const entry = await tx.rateLimitBucket.findUnique({
            where: { key: storedKey },
            select: { count: true, resetAt: true },
        });

        if (!entry || entry.resetAt <= now) {
            await tx.rateLimitBucket.upsert({
                where: { key: storedKey },
                create: { key: storedKey, count: 1, resetAt },
                update: { count: 1, resetAt },
            });
            return { allowed: true, remaining: max - 1, retryAfterMs: 0, max };
        }

        const retryAfterMs = Math.max(0, entry.resetAt.getTime() - now.getTime());

        if (entry.count >= max) {
            return { allowed: false, remaining: 0, retryAfterMs, max };
        }

        const updated = await tx.rateLimitBucket.update({
            where: { key: storedKey },
            data: { count: { increment: 1 } },
            select: { count: true },
        });

        return { allowed: true, remaining: Math.max(0, max - updated.count), retryAfterMs: 0, max };
    });
}

/**
 * Resolves the client address for rate-limit bucketing.
 *
 * `x-forwarded-for` is a list appended to by every proxy in the chain, so the
 * *last* entry is the one written by our own edge and is the only value a
 * client cannot forge by itself. Taking the first entry, as this used to, let
 * anyone reset their bucket with a single forged header.
 *
 * nginx is configured with `proxy_set_header X-Forwarded-For $remote_addr`,
 * which overwrites rather than appends, so with a single trusted hop the last
 * entry is the real client address.
 */
export function getClientKey(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        const hops = forwarded
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean);
        const last = hops[hops.length - 1];
        if (last) return normalizeAddress(last);
    }

    const real = request.headers.get("x-real-ip")?.trim();
    if (real) return normalizeAddress(real);

    // No proxy headers at all (direct hit, or a platform that strips them).
    // Bucketing everything into one key is fail-closed rather than fail-open.
    return "unknown";
}

function normalizeAddress(value: string): string {
    // Strip an IPv6 bracket form and any :port suffix so the same client
    // cannot mint extra buckets by varying the port.
    const unbracketed = value.startsWith("[") && value.includes("]") ? value.slice(1, value.indexOf("]")) : value;
    const withoutPort = unbracketed.includes(":") && (unbracketed.match(/:/g)?.length ?? 0) === 1 ? unbracketed.slice(0, unbracketed.indexOf(":")) : unbracketed;
    return withoutPort.slice(0, 45) || "unknown";
}
