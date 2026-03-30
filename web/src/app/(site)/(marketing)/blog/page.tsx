import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { OrionMark } from "@/components/effects/OrionMark";

export default async function BlogPage() {
    const posts = await getAllPosts();

    return (
        <main className="relative bg-background overflow-hidden">
            <section className="relative section-py pt-32 overflow-hidden">
                <div className="absolute -right-[10%] top-[5%] w-[45%] h-[75%] pointer-events-none">
                    <OrionMark variant="minimal" lineOpacity={0.05} globalOpacity={0.3} rotate={10} />
                </div>

                <div className="relative z-10 section-container">
                    <LineReveal className="mb-16 lg:mb-24" />

                    <div className="space-y-8 max-w-3xl">
                        <span className="text-index text-foreground-muted">Insights</span>

                        <TextReveal as="h1" type="words" className="text-title lg:text-[clamp(2.5rem,5vw,5rem)] lg:leading-[1.0]">
                            From the studio
                        </TextReveal>

                        <TextReveal
                            as="p"
                            type="lines"
                            className="text-body-lg text-foreground-muted max-w-[52ch]"
                            delay={0.2}
                        >
                            Thoughts on design, engineering, and the craft of building
                            digital products.
                        </TextReveal>
                    </div>
                </div>
            </section>

            <section className="section-container pb-32">
                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-body-lg text-foreground-muted">Coming soon.</p>
                    </div>
                ) : (
                    <div className="space-y-0">
                        {posts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group block py-8 lg:py-10 border-t border-border hover:bg-surface-1/50 transition-colors duration-300 -mx-6 px-6 rounded-lg"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    <div className="flex-1 space-y-3">
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
                                        <h2 className="text-heading group-hover:text-accent transition-colors duration-300">
                                            {post.title}
                                        </h2>
                                        <p className="text-body-lg text-foreground-muted max-w-[60ch]">
                                            {post.description}
                                        </p>
                                    </div>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        className="mt-2 opacity-0 group-hover:opacity-60 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 shrink-0"
                                    >
                                        <path d="M1 15L15 1M15 1H5M15 1V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
