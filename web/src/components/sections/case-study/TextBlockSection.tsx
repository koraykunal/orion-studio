"use client";

import { TextReveal } from "@/components/motion/TextReveal";
import type { TextBlockData } from "@/lib/project-types";

export function TextBlockSection({ data }: { data: TextBlockData }) {
    return (
        <div className="section-container">
            <div className="grid-container gap-y-8">
                <div className="col-span-12 lg:col-span-5">
                    <TextReveal as="h2" type="words" className="text-heading">
                        {data.title}
                    </TextReveal>
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
