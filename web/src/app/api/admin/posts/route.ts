import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
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
    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!body.slug || !body.slug.trim()) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description ?? "",
        content: body.content ?? null,
        contentHtml: body.contentHtml ?? "",
        tags: body.tags ?? [],
        coverImage: body.coverImage ?? null,
        status: body.status ?? "draft",
        publishedAt: body.status === "published" ? new Date() : null,
        authorId: body.authorId,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
    }
    console.error("POST /api/admin/posts error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
