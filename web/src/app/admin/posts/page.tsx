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

export default async function PostsListPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      tags: true,
      createdAt: true,
    },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-title text-foreground">Posts</h1>
        <Button asChild>
          <Link href="/admin/posts/new">New Post</Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className="mt-8 text-foreground-muted">No posts yet.</p>
      ) : (
        <Table className="mt-8">
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="font-medium text-foreground hover:text-accent"
                  >
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      post.status === "published"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }
                  >
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground-muted">
                  {post.tags.slice(0, 2).join(", ")}
                </TableCell>
                <TableCell className="text-foreground-muted">
                  {post.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
