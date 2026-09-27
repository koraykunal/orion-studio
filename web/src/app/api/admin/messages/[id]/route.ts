import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/admin-guard";
import { enumValue, isPlainObject, LIMITS, nullableStringValue } from "@/lib/validation";

export const dynamic = "force-dynamic";

const MESSAGE_STATUSES = ["unread", "read", "archived"] as const;
type MessageStatus = (typeof MESSAGE_STATUSES)[number];

function isNotFound(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { failure } = await requireAdmin();
  if (failure) return failure;

  try {
    const { id } = await params;
    const message = await prisma.message.findUnique({ where: { id } });

    if (!message) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("GET /api/admin/messages/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch message" }, { status: 500 });
  }
}

/**
 * Updates only the two fields an editor is allowed to change: workflow status
 * and internal notes. PII submitted by a visitor is never writable.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { failure } = await requireAdmin();
  if (failure) return failure;

  try {
    const { id } = await params;
    const body: unknown = await request.json();

    if (!isPlainObject(body)) {
      return NextResponse.json({ error: "Malformed request body" }, { status: 400 });
    }

    const data: { status?: MessageStatus; readAt?: Date | null; notes?: string | null } = {};

    if (body.status !== undefined) {
      const status = enumValue(body.status, MESSAGE_STATUSES, null as unknown as MessageStatus);
      if (status === null) {
        return NextResponse.json(
          { error: `Status must be one of: ${MESSAGE_STATUSES.join(", ")}` },
          { status: 400 },
        );
      }
      data.status = status;
      // readAt is derived from the transition, never accepted from the client,
      // and is cleared when a message goes back to unread.
      data.readAt = status === "read" ? new Date() : null;
    }

    if (body.notes !== undefined) {
      if (typeof body.notes !== "string") {
        return NextResponse.json({ error: "Notes must be a string" }, { status: 400 });
      }
      data.notes = nullableStringValue(body.notes.slice(0, LIMITS.longText));
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const message = await prisma.message.update({ where: { id }, data });

    return NextResponse.json(message);
  } catch (error) {
    if (isNotFound(error)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("PUT /api/admin/messages/[id] error:", error);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

/**
 * Hard delete, for GDPR erasure requests. There is no UI for this; it exists
 * so a data-subject request can be satisfied without a database shell.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { failure } = await requireAdmin();
  if (failure) return failure;

  try {
    const { id } = await params;
    await prisma.message.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isNotFound(error)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("DELETE /api/admin/messages/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
