import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { pingIndexNow } from "@/lib/indexnow";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/admin/projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.client || !body.client.trim()) {
      return NextResponse.json({ error: "Client name is required" }, { status: 400 });
    }

    if (!body.slug || !body.slug.trim()) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const maxOrder = await prisma.project.aggregate({ _max: { order: true } });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    const project = await prisma.project.create({
      data: {
        slug: body.slug,
        client: body.client,
        tagline_en: body.tagline_en ?? "",
        tagline_tr: body.tagline_tr ?? null,
        year: body.year ?? "",
        services: body.services ?? [],
        outcome_en: body.outcome_en ?? "",
        outcome_tr: body.outcome_tr ?? null,
        image: body.image ?? "",
        category: body.category ?? "client",
        sections: body.sections || [],
        featured: body.featured ?? false,
        status: body.status ?? "draft",
        order: nextOrder,
      },
    });

    if (project.status === "published") {
      void pingIndexNow([`/work/${project.slug}`, "/work"]);
    }

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "A project with this slug already exists" }, { status: 409 });
    }
    console.error("POST /api/admin/projects error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
