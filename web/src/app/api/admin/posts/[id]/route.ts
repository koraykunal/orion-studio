import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { pingIndexNow } from "@/lib/indexnow";
import { requireAdmin } from "@/lib/admin-guard";
import { buildPostWriteData, validatePostWrite } from "@/lib/post-validation";
import { revalidateContent } from "@/lib/cache-tags";

export const dynamic = "force-dynamic";

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
  const { failure } = await requireAdmin();
  if (failure) return failure;

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Allowlist build. Spreading the body here would let a client rewrite
    // authorId, id or createdAt, and would silently expose every column added
    // to the model in the future.
    const data = buildPostWriteData(body, existing);
    const errors = validatePostWrite(data);
    if (errors.length) {
      return NextResponse.json({ error: errors[0], errors }, { status: 400 });
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...data,
        // Stamp the publish date once, on the transition into published, and
        // never let it be rewritten afterwards.
        ...(data.status === "published" && !existing.publishedAt ? { publishedAt: new Date() } : {}),
      },
    });

    revalidateContent("posts", { slug: post.slug });
    if (existing.slug !== post.slug) revalidateContent("posts", { slug: existing.slug });

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
  const { failure } = await requireAdmin();
  if (failure) return failure;

  try {
    const { id } = await params;
    const existing = await prisma.post.findUnique({ where: { id }, select: { slug: true } });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.post.delete({ where: { id } });

    revalidateContent("posts", { slug: existing.slug });
    void pingIndexNow(["/blog"]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isNotFound(error)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("DELETE /api/admin/posts/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
