import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { pingIndexNow } from "@/lib/indexnow";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("GET /api/admin/posts/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = { ...body };

    if (body.status === "published" && !existing.publishedAt) {
      data.publishedAt = new Date();
    }

    const post = await prisma.post.update({ where: { id }, data });

    if (post.status === "published") {
      void pingIndexNow([`/blog/${post.slug}`, "/blog"]);
    }

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
    }
    console.error("PUT /api/admin/posts/[id] error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/posts/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
