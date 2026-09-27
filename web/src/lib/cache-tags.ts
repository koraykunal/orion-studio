import { revalidatePath, revalidateTag } from "next/cache";
import { LOCALES } from "@/lib/locales";

/**
 * Cache tags for the two content collections.
 *
 * Read queries in lib/projects.ts and lib/blog.ts are wrapped in
 * `unstable_cache` with these tags, so a write can invalidate exactly the
 * derived data it affects instead of relying on a fixed TTL. The previous
 * setup had no revalidation at all, which meant an editor's change could take
 * five minutes to become public while IndexNow was telling search engines the
 * content was already live.
 */
export const CACHE_TAGS = {
    projects: "projects",
    projectSlugs: "project-slugs",
    posts: "posts",
    postSlugs: "post-slugs",
} as const;

export type ContentKind = "projects" | "posts";

const PATHS: Record<ContentKind, { tags: string[]; paths: string[] }> = {
    projects: {
        tags: [CACHE_TAGS.projects, CACHE_TAGS.projectSlugs],
        paths: ["/en/work", "/tr/work", "/en", "/tr", "/sitemap.xml"],
    },
    posts: {
        tags: [CACHE_TAGS.posts, CACHE_TAGS.postSlugs],
        paths: ["/en/blog", "/tr/blog", "/sitemap.xml"],
    },
};

/**
 * Invalidates a collection and, when a slug is supplied, the individual
 * detail pages too. `/en` and `/tr` are included because both the landing
 * page and the work index render the newest projects.
 *
 * `{ expire: 0 }` expires the tagged entries on the next read, which is what
 * a route handler wants. `updateTag` is deliberately not used: it only works
 * inside a Server Action.
 */
export function revalidateContent(kind: ContentKind, options: { slug?: string } = {}): void {
    const { tags, paths } = PATHS[kind];

    for (const tag of tags) {
        revalidateTag(tag, { expire: 0 });
    }
    for (const path of paths) {
        revalidatePath(path);
    }

    if (!options.slug) return;

    for (const locale of LOCALES) {
        const detail = kind === "projects" ? `/${locale}/work/${options.slug}` : `/${locale}/blog/${options.slug}`;
        revalidatePath(detail);
    }
}
