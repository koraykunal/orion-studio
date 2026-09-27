export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminDashboard() {
  const [unreadCount, recentMessages, recentPosts, projectGroups] =
    await Promise.all([
      prisma.message.count({ where: { status: "unread" } }),
      prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.post.findMany({
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
        take: 5,
      }),
      prisma.project.groupBy({ by: ["status"], _count: true }),
    ]);

  const publishedPostCount = recentPosts.length;
  const totalProjects = projectGroups.reduce((s, g) => s + g._count, 0);
  const draftProjects =
    projectGroups.find((g) => g.status === "draft")?._count ?? 0;

  return (
    <>
      <h1 className="text-title text-foreground">Dashboard</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/messages">
          <Card className="transition-colors hover:border-accent/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-label text-foreground-muted font-normal">
                Unread Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">
                {unreadCount}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/posts">
          <Card className="transition-colors hover:border-accent/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-label text-foreground-muted font-normal">
                Published Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">
                {publishedPostCount}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/projects">
          <Card className="transition-colors hover:border-accent/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-label text-foreground-muted font-normal">
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">
                {totalProjects}
              </p>
              {draftProjects > 0 && (
                <p className="mt-1 text-sm text-foreground-muted">
                  {draftProjects} draft{draftProjects !== 1 && "s"}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="text-heading text-foreground">Recent Messages</h2>
        {recentMessages.length === 0 ? (
          <p className="mt-4 text-foreground-muted">No messages yet.</p>
        ) : (
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Brief</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentMessages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell className="font-medium">{msg.name}</TableCell>
                  <TableCell className="text-foreground-muted">
                    {msg.email}
                  </TableCell>
                  <TableCell className="text-foreground-muted line-clamp-1 max-w-xs">
                    {msg.brief}
                  </TableCell>
                  <TableCell className="text-right">
                    {msg.status === "unread" && (
                      <Badge variant="secondary" className="bg-accent/10 text-accent">
                        Unread
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-heading text-foreground">Recent Posts</h2>
        {recentPosts.length === 0 ? (
          <p className="mt-4 text-foreground-muted">No published posts yet.</p>
        ) : (
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="font-medium text-foreground hover:text-accent"
                    >
                      {post.title_en}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right text-foreground-muted">
                    {post.publishedAt?.toLocaleDateString("en-US", {
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
      </section>
    </>
  );
}
