import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const categoryColors: Record<string, string> = {
  client: "bg-blue-500/10 text-blue-400",
  concept: "bg-purple-500/10 text-purple-400",
  studio: "bg-pink-500/10 text-pink-400",
};

export default async function ProjectsListPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      client: true,
      category: true,
      status: true,
      featured: true,
    },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-title text-foreground">Projects</h1>
        <Button asChild>
          <Link href="/admin/projects/new">New Project</Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="mt-8 text-foreground-muted">No projects yet.</p>
      ) : (
        <Table className="mt-8">
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="font-medium text-foreground hover:text-accent"
                  >
                    {project.client}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={categoryColors[project.category] ?? ""}
                  >
                    {project.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      project.status === "published"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }
                  >
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground-muted">
                  {project.featured ? "Yes" : "No"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
