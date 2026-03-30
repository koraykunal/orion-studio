import { prisma } from "@/lib/prisma";

export type BlogPost = {
    slug: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    contentHtml: string;
    coverImage: string | null;
};

export async function getAllPosts(): Promise<BlogPost[]> {
    const posts = await prisma.post.findMany({
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
        select: {
            slug: true,
            title: true,
            description: true,
            publishedAt: true,
            tags: true,
            contentHtml: true,
            coverImage: true,
        },
    });

    return posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        description: post.description,
        date: post.publishedAt?.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }) ?? "",
        tags: post.tags,
        contentHtml: post.contentHtml,
        coverImage: post.coverImage,
    }));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const post = await prisma.post.findFirst({
        where: { slug, status: "published" },
        select: {
            slug: true,
            title: true,
            description: true,
            publishedAt: true,
            tags: true,
            contentHtml: true,
            coverImage: true,
        },
    });

    if (!post) return undefined;

    return {
        slug: post.slug,
        title: post.title,
        description: post.description,
        date: post.publishedAt?.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }) ?? "",
        tags: post.tags,
        contentHtml: post.contentHtml,
        coverImage: post.coverImage,
    };
}
