import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { pingIndexNow } from "@/lib/indexnow";
import { buildProjectWriteData, validateProjectWrite } from "@/lib/project-validation";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidateContent } from "@/lib/cache-tags";

export const dynamic = "force-dynamic";

/** A reorder payload larger than this is a mistake or an attempt to pin a connection. */
const MAX_REORDER_ITEMS = 200;
const MAX_ORDER = 1_000_000;

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
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("GET /api/admin/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
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

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (Array.isArray(body?.reorder)) {
      // Validated and bounded before any write. An unbounded array here would
      // queue one UPDATE per element inside a single interactive transaction,
      // holding a pooled connection for the duration.
      if (body.reorder.length > MAX_REORDER_ITEMS) {
        return NextResponse.json(
          { error: `A reorder may contain at most ${MAX_REORDER_ITEMS} entries` },
          { status: 400 },
        );
      }

      const entries = (body.reorder as unknown[]).filter(
        (item): item is { id: string; order: number } =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as { id?: unknown }).id === "string" &&
          Number.isInteger((item as { order?: unknown }).order) &&
          Math.abs((item as { order: number }).order) <= MAX_ORDER,
      );

      if (entries.length !== body.reorder.length) {
        return NextResponse.json({ error: "Malformed reorder payload" }, { status: 400 });
      }

      await prisma.$transaction(
        entries.map((item) => prisma.project.update({ where: { id: item.id }, data: { order: item.order } })),
      );

      revalidateContent("projects");
      return NextResponse.json({ ok: true });
    }

    const data = buildProjectWriteData(body, existing);
    const errors = validateProjectWrite(data);
    if (errors.length) {
      return NextResponse.json({ error: errors[0], errors }, { status: 400 });
    }

    const project = await prisma.project.update({ where: { id }, data });

    revalidateContent("projects", { slug: project.slug });
    if (existing.slug !== project.slug) revalidateContent("projects", { slug: existing.slug });

    if (project.status === "published") {
      void pingIndexNow([`/work/${project.slug}`, "/work"]);
    }

    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "A project with this slug already exists" }, { status: 409 });
    }
    console.error("PUT /api/admin/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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
    const existing = await prisma.project.findUnique({ where: { id }, select: { slug: true } });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.project.delete({ where: { id } });

    revalidateContent("projects", { slug: existing.slug });
    void pingIndexNow(["/work"]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isNotFound(error)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("DELETE /api/admin/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
