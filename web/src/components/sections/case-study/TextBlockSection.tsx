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
                    <div className="col-span-12 lg:col-span-5">
                        {data.title && (
                            <TextReveal as="h2" type="words" className="text-heading">
                                {data.title}
                            </TextReveal>
                        )}
                    </div>
                    <div className="col-span-12 lg:col-start-7 lg:col-span-6">
                        <div
                            className="prose-orion"
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
            <div className={`flex flex-col gap-6 lg:gap-8 ${alignClass}`}>
                {data.title && (
                    <TextReveal as="h2" type="words" className="text-heading max-w-4xl">
                        {data.title}
                    </TextReveal>
                )}
                <div
                    className={`prose-orion w-full max-w-3xl ${
                        layout === "stackedCenter" ? "mx-auto" : layout === "stackedRight" ? "ml-auto" : ""
                    }`}
                    dangerouslySetInnerHTML={{ __html: data.contentHtml }}
                />
            </div>
        </div>
    );
}
