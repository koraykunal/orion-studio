import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { pingIndexNow } from "@/lib/indexnow";
import { requireAdmin } from "@/lib/admin-guard";
import { buildPostWriteData, validatePostWrite } from "@/lib/post-validation";
import { revalidateContent } from "@/lib/cache-tags";

export const dynamic = "force-dynamic";

export async function GET() {
  const { failure } = await requireAdmin();
  if (failure) return failure;

  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title_en: true,
        title_tr: true,
        slug: true,
        status: true,
        tags: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/admin/posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { session, failure } = await requireAdmin();
  if (failure) return failure;

  try {
    // authorId is always derived from the session, never from the request
    // body, so authorship cannot be forged on create.
    const author = await prisma.user.findUnique({ where: { id: session.userId }, select: { id: true } });
    if (!author) {
      return NextResponse.json(
        { error: "Session user no longer exists. Sign out and sign in again." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const data = buildPostWriteData(body);
    const errors = validatePostWrite(data);
    if (errors.length) {
      return NextResponse.json({ error: errors[0], errors }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        ...data,
        publishedAt: data.status === "published" ? new Date() : null,
        authorId: author.id,
      },
    });

    revalidateContent("posts", { slug: post.slug });

    if (post.status === "published") {
      void pingIndexNow([`/blog/${post.slug}`, "/blog"]);
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
    }
    console.error("POST /api/admin/posts error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
