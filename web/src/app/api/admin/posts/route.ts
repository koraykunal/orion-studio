import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { pingIndexNow } from "@/lib/indexnow";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title_en: true,
        slug: true,
        status: true,
        tags: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/admin/posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const sessionUserId = (session?.user as { id?: string } | undefined)?.id;
    if (!sessionUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const author = await prisma.user.findUnique({ where: { id: sessionUserId } });
    if (!author) {
      return NextResponse.json(
        { error: "Session user no longer exists. Sign out and sign in again." },
        { status: 401 },
      );
    }

    const body = await request.json();

    if (!body.title_en || !body.title_en.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!body.slug || !body.slug.trim()) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title_en: body.title_en,
        title_tr: body.title_tr ?? null,
        slug: body.slug,
        description: body.description ?? "",
        content: body.content ?? null,
        contentHtml_en: body.contentHtml_en ?? "",
        contentHtml_tr: body.contentHtml_tr ?? null,
        tags: body.tags ?? [],
        coverImage: body.coverImage ?? null,
        status: body.status ?? "draft",
        publishedAt: body.status === "published" ? new Date() : null,
        authorId: author.id,
      },
    });

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
