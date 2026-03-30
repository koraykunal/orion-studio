import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};

    if (body.status !== undefined) {
      data.status = body.status;
      if (body.status === "read") {
        data.readAt = new Date();
      }
    }

    if (body.notes !== undefined) {
      data.notes = body.notes;
    }

    const message = await prisma.message.update({
      where: { id },
      data,
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("PUT /api/admin/messages/[id] error:", error);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}
