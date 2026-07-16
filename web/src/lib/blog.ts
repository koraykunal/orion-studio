import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { sanitizeRichHtml } from "@/lib/sanitize";

export type BlogPost = {
    slug: string;
    title: string;
    description: string;
    date: string;
    publishedAt: Date | null;
    tags: string[];
    contentHtml: string;
    coverImage: string | null;
};

function getLocalizedStr(en: string, tr: string | null | undefined, locale: string): string {
    if (locale === "tr" && tr) return tr;
    return en;
}

const publishedPostSelect = {
    slug: true,
    title_en: true,
    title_tr: true,
    description: true,
    publishedAt: true,
    tags: true,
    contentHtml_en: true,
    contentHtml_tr: true,
    coverImage: true,
} as const;

const getCachedPublishedPosts = unstable_cache(
    async () =>
        prisma.post.findMany({
            where: { status: "published" },
            orderBy: { publishedAt: "desc" },
            select: publishedPostSelect,
        }),
    ["published-posts"],
    { revalidate: 300 },
);

const getCachedPublishedPostBySlug = unstable_cache(
    async (slug: string) =>
        prisma.post.findFirst({
            where: { slug, status: "published" },
            select: publishedPostSelect,
        }),
    ["published-post-by-slug"],
    { revalidate: 300 },
);

const getCachedPublishedPostSlugs = unstable_cache(
    async () =>
        prisma.post.findMany({
            where: { status: "published" },
            orderBy: { publishedAt: "desc" },
            select: { slug: true },
        }),
    ["published-post-slugs"],
    { revalidate: 300 },
);

type PublishedPostRecord = Awaited<ReturnType<typeof getCachedPublishedPosts>>[number];

function mapPost(post: PublishedPostRecord, locale: string): BlogPost {
    return {
        slug: post.slug,
        title: getLocalizedStr(post.title_en, post.title_tr, locale),
        description: post.description,
        date: post.publishedAt?.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }) ?? "",
        publishedAt: post.publishedAt,
        tags: post.tags,
        contentHtml: sanitizeRichHtml(getLocalizedStr(post.contentHtml_en, post.contentHtml_tr, locale)),
        coverImage: post.coverImage,
    };
}

export async function getAllPosts(locale: string): Promise<BlogPost[]> {
    const posts = await getCachedPublishedPosts();

    return posts.map((post) => mapPost(post, locale));
}

export async function getPostBySlug(slug: string, locale: string): Promise<BlogPost | undefined> {
    const post = await getCachedPublishedPostBySlug(slug);

    if (!post) return undefined;

    return mapPost(post, locale);
}

export async function getPublishedPostSlugs(): Promise<string[]> {
    const posts = await getCachedPublishedPostSlugs();
    return posts.map((post) => post.slug);
}
