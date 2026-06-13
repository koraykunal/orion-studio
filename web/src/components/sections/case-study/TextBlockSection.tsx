"use client";

import { TextReveal } from "@/components/motion/TextReveal";
import type { TextBlockData, TextBlockLayout } from "@/lib/project-types";

const STACKED_ALIGN: Record<Exclude<TextBlockLayout, "side">, string> = {
    stackedLeft: "text-left items-start",
    stackedCenter: "text-center items-center",
    stackedRight: "text-right items-end",
};

export function TextBlockSection({ data }: { data: TextBlockData }) {
    const layout: TextBlockLayout = data.layout ?? "side";

    if (layout === "side") {
        return (
            <div className="section-container">
                <div className="grid-container gap-y-8">
                    <div className="col-span-12 lg:col-span-3">
                        {data.title && (
                            <TextReveal as="h2" type="words" className="text-caption text-foreground-subtle">
                                {data.title}
                            </TextReveal>
                        )}
                    </div>
                    <div className="col-span-12 border-t border-border-subtle pt-8 lg:col-span-7 lg:col-start-5">
                        <div
                            className="prose-orion max-w-[54ch] [&_p]:text-[clamp(1.25rem,2vw,1.85rem)] [&_p]:leading-[1.45] [&_p]:text-foreground-muted"
                            dangerouslySetInnerHTML={{ __html: data.contentHtml }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    const alignClass = STACKED_ALIGN[layout];

    return (
        <div className="section-container">
            <div className={`flex flex-col gap-6 border-t border-border-subtle pt-8 lg:gap-8 ${alignClass}`}>
                {data.title && (
                    <TextReveal as="h2" type="words" className="text-caption text-foreground-subtle">
                        {data.title}
                    </TextReveal>
                )}
                <div
                    className={`prose-orion w-full max-w-3xl [&_p]:text-[clamp(1.25rem,2vw,1.85rem)] [&_p]:leading-[1.45] [&_p]:text-foreground-muted ${
                        layout === "stackedCenter" ? "mx-auto" : layout === "stackedRight" ? "ml-auto" : ""
                    }`}
                    dangerouslySetInnerHTML={{ __html: data.contentHtml }}
                />
            </div>
        </div>
    );
}
