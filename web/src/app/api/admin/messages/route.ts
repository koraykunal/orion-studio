import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

/**
 * Contact inquiries, newest first.
 *
 * Explicit field list and bounded paging. This route previously returned every
 * row in the table with no pagination and no error handling, which made it both
 * the largest PII surface in the app and a single point of failure: one database
 * error became an unhandled rejection rather than a JSON 500.
 *
 * The response is an envelope, not a bare array, so the caller knows the total
 * without a second request. The consumer is admin/(dashboard)/messages/page.tsx.
 */
export async function GET(request: Request) {
  const { failure } = await requireAdmin();
  if (failure) return failure;

  try {
    const { searchParams } = new URL(request.url);

    const rawLimit = Number.parseInt(searchParams.get("limit") ?? "", 10);
    const rawOffset = Number.parseInt(searchParams.get("offset") ?? "", 10);

    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), MAX_LIMIT) : DEFAULT_LIMIT;
    const offset = Number.isFinite(rawOffset) ? Math.max(rawOffset, 0) : 0;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          services: true,
          budget: true,
          timeline: true,
          brief: true,
          referral: true,
          status: true,
          readAt: true,
          createdAt: true,
        },
      }),
      prisma.message.count(),
    ]);

    return NextResponse.json({ messages, total, limit, offset }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("GET /api/admin/messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
