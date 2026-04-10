export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { getTranslations } from "next-intl/server";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { OrionMark } from "@/components/effects/OrionMark";

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const posts = await getAllPosts(locale);
    const t = await getTranslations({ locale, namespace: "blog" });

    return (
        <main className="relative bg-background overflow-hidden">
            <section className="relative section-py pt-32 overflow-hidden">
                <div className="absolute -right-[10%] top-[5%] w-[45%] h-[75%] pointer-events-none">
                    <OrionMark variant="minimal" lineOpacity={0.05} globalOpacity={0.3} rotate={10} />
                </div>
                <div className="relative z-10 section-container">
                    <LineReveal className="mb-16 lg:mb-24" />
                    <div className="space-y-8 max-w-3xl">
                        <span className="text-index text-foreground-muted">{t("pageLabel")}</span>
                        <TextReveal as="h1" type="words" className="text-title lg:text-[clamp(2.5rem,5vw,5rem)] lg:leading-[1.0]">
                            {t("pageTitle")}
                        </TextReveal>
                        <TextReveal as="p" type="lines" className="text-body-lg text-foreground-muted max-w-[52ch]" delay={0.2}>
                            {t("pageDescription")}
                        </TextReveal>
                    </div>
                </div>
            </section>
            <section className="section-container pb-32">
                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-body-lg text-foreground-muted">{t("comingSoon")}</p>
                    </div>
                ) : (
                    <div className="space-y-0">
                        {posts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/${locale}/blog/${post.slug}`}
                                className="group block py-8 border-b border-border-subtle hover:border-border transition-colors duration-300"
                            >
                                <div className="flex items-start justify-between gap-8">
                                    <div className="flex-1 space-y-3">
                                        <h2 className="text-heading group-hover:text-accent transition-colors duration-300">{post.title}</h2>
                                        <p className="text-body text-foreground-muted max-w-[60ch]">{post.description}</p>
                                        <div className="flex items-center gap-4">
                                            <span className="text-caption text-foreground-subtle">{post.date}</span>
                                            {post.tags.slice(0, 2).map((tag) => (
                                                <span key={tag} className="text-caption px-2 py-0.5 rounded-full border border-border text-foreground-muted">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-label text-foreground-subtle group-hover:text-accent transition-colors duration-300 shrink-0 mt-1">{t("readMore")}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
