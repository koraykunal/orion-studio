import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug } from "@/lib/blog";
import { LineReveal } from "@/components/motion/LineReveal";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string; locale: string }> };

export const dynamicParams = true;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const post = await getPostBySlug(slug, locale);
    if (!post) return { title: "Not Found" };

    return {
        title: `${post.title} — Orion Studio`,
        description: post.description,
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug, locale } = await params;
    const post = await getPostBySlug(slug, locale);
    if (!post) notFound();

    return (
        <main className="relative bg-background overflow-hidden">
            <section className="relative section-py pt-32">
                <div className="section-container">
                    <Link
                        href={`/${locale}/blog`}
                        className="inline-flex items-center gap-2 text-label text-foreground-muted hover:text-foreground transition-colors duration-300 mb-12"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        All Posts
                    </Link>

                    <div className="max-w-3xl space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="text-label text-foreground-muted">{post.date}</span>
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2.5 py-1 rounded-full border border-border text-[0.6rem] uppercase tracking-[0.12em] text-foreground-muted"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-title">{post.title}</h1>

                        <p className="text-editorial !text-foreground-muted/80">
                            {post.description}
                        </p>
                    </div>

                    <LineReveal className="my-12 lg:my-16" />

                    <article
                        className="prose-orion max-w-3xl"
                        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                    />
                </div>
            </section>
        </main>
    );
}
