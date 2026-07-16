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
};

function hashKey(key: string): string {
    return createHash("sha256").update(key).digest("hex");
}

export async function rateLimit({ key, windowMs, max }: RateLimitOptions): Promise<RateLimitResult> {
    const now = new Date();
    const resetAt = new Date(now.getTime() + windowMs);
    const storedKey = hashKey(key);

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
            return { allowed: true, remaining: max - 1, retryAfterMs: 0 };
        }

        const retryAfterMs = Math.max(0, entry.resetAt.getTime() - now.getTime());

        if (entry.count >= max) {
            return { allowed: false, remaining: 0, retryAfterMs };
        }

        const updated = await tx.rateLimitBucket.update({
            where: { key: storedKey },
            data: { count: { increment: 1 } },
            select: { count: true },
        });

        return { allowed: true, remaining: Math.max(0, max - updated.count), retryAfterMs: 0 };
    });
}

export function getClientKey(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    const real = request.headers.get("x-real-ip");
    if (real) return real;
    return "unknown";
}
