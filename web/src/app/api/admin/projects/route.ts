import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { pingIndexNow } from "@/lib/indexnow";
import { buildProjectWriteData, validateProjectWrite } from "@/lib/project-validation";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidateContent } from "@/lib/cache-tags";

export const dynamic = "force-dynamic";

export async function GET() {
  const { failure } = await requireAdmin();
  if (failure) return failure;

  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        client: true,
        year: true,
        image: true,
        category: true,
        serviceCategory: true,
        featured: true,
        status: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/admin/projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { failure } = await requireAdmin();
  if (failure) return failure;

  try {
    const body = await request.json();
    const data = buildProjectWriteData(body);
    const errors = validateProjectWrite(data);
    if (errors.length) {
      return NextResponse.json({ error: errors[0], errors }, { status: 400 });
    }

    // Assign the next slot inside the same transaction that inserts the row,
    // so two concurrent creates cannot claim the same position.
    const project = await prisma.$transaction(async (tx) => {
      const maxOrder = await tx.project.aggregate({ _max: { order: true } });
      return tx.project.create({
        data: { ...data, order: (maxOrder._max.order ?? -1) + 1 },
      });
    });

    revalidateContent("projects", { slug: project.slug });

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
