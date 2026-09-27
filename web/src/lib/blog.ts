import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { sanitizeRichHtml } from "@/lib/sanitize";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { localizedValue, type Locale } from "@/lib/locales";

export type BlogPost = {
    slug: string;
    title: string;
    description: string;
    date: string;
    /** Machine-readable date for <time datetime>. */
    isoDate: string;
    publishedAt: Date | null;
    tags: string[];
    contentHtml: string;
    coverImage: string | null;
};

/**
 * Long TTL as a safety net only. Correct invalidation comes from
 * revalidateContent("posts") on every write, so an editor sees their change
 * immediately instead of after five minutes.
 */
const REVALIDATE_SECONDS = 60 * 60;

const publishedPostSelect = {
    slug: true,
    title_en: true,
    title_tr: true,
    description: true,
    description_en: true,
    description_tr: true,
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
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.posts] },
);

const getCachedPublishedPostBySlug = unstable_cache(
    async (slug: string) =>
        prisma.post.findFirst({
            where: { slug, status: "published" },
            select: publishedPostSelect,
        }),
    ["published-post-by-slug"],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.posts, CACHE_TAGS.postSlugs] },
);

const getCachedPublishedPostSlugs = unstable_cache(
    async () =>
        prisma.post.findMany({
            where: { status: "published" },
            orderBy: { publishedAt: "desc" },
            select: { slug: true },
        }),
    ["published-post-slugs"],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.postSlugs] },
);

type PublishedPostRecord = Awaited<ReturnType<typeof getCachedPublishedPosts>>[number];

function formatDate(value: Date | null, locale: Locale): { date: string; isoDate: string } {
    if (!value) return { date: "", isoDate: "" };
    // A fixed, explicit locale rather than the server default, so the same post
    // renders the same string on every machine.
    const tag = locale === "tr" ? "tr-TR" : "en-GB";
    return {
        date: value.toLocaleDateString(tag, { day: "numeric", month: "long", year: "numeric" }),
        isoDate: value.toISOString(),
    };
}

function mapPost(post: PublishedPostRecord, locale: Locale): BlogPost {
    const { date, isoDate } = formatDate(post.publishedAt, locale);

    return {
        slug: post.slug,
        title: localizedValue(post.title_tr, post.title_en, locale),
        // description_en/_tr are the localised columns; description is the
        // legacy single-locale fallback for rows written before localisation.
        description: localizedValue(
            post.description_tr,
            localizedValue(post.description_en, post.description, "en"),
            locale,
        ),
        date,
        isoDate,
        publishedAt: post.publishedAt,
        tags: post.tags,
        contentHtml: sanitizeRichHtml(
            localizedValue(post.contentHtml_tr, post.contentHtml_en, locale),
        ),
        coverImage: post.coverImage,
    };
}

export async function getAllPosts(locale: Locale): Promise<BlogPost[]> {
    const posts = await getCachedPublishedPosts();
    return posts.map((post) => mapPost(post, locale));
}

export async function getPostBySlug(slug: string, locale: Locale): Promise<BlogPost | undefined> {
    const post = await getCachedPublishedPostBySlug(slug);
    return post ? mapPost(post, locale) : undefined;
}

/** Used by generateStaticParams and the sitemap. */
export async function getPublishedPostSlugs(): Promise<string[]> {
    const posts = await getCachedPublishedPostSlugs();
    return posts.map((post) => post.slug);
}
