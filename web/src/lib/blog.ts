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

function getLocalizedStr(en: string, tr: string | null | undefined, locale: string): string {
    if (locale === "tr" && tr) return tr;
    return en;
}

export async function getAllPosts(locale: string): Promise<BlogPost[]> {
    const posts = await prisma.post.findMany({
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
        select: {
            slug: true,
            title_en: true,
            title_tr: true,
            description: true,
            publishedAt: true,
            tags: true,
            contentHtml_en: true,
            contentHtml_tr: true,
            coverImage: true,
        },
    });

    return posts.map((post) => ({
        slug: post.slug,
        title: getLocalizedStr(post.title_en, post.title_tr, locale),
        description: post.description,
        date: post.publishedAt?.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }) ?? "",
        tags: post.tags,
        contentHtml: getLocalizedStr(post.contentHtml_en, post.contentHtml_tr, locale),
        coverImage: post.coverImage,
    }));
}

export async function getPostBySlug(slug: string, locale: string): Promise<BlogPost | undefined> {
    const post = await prisma.post.findFirst({
        where: { slug, status: "published" },
        select: {
            slug: true,
            title_en: true,
            title_tr: true,
            description: true,
            publishedAt: true,
            tags: true,
            contentHtml_en: true,
            contentHtml_tr: true,
            coverImage: true,
        },
    });

    if (!post) return undefined;

    return {
        slug: post.slug,
        title: getLocalizedStr(post.title_en, post.title_tr, locale),
        description: post.description,
        date: post.publishedAt?.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }) ?? "",
        tags: post.tags,
        contentHtml: getLocalizedStr(post.contentHtml_en, post.contentHtml_tr, locale),
        coverImage: post.coverImage,
    };
}
