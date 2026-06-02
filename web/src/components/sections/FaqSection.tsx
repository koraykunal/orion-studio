"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { TextReveal } from "@/components/motion/TextReveal";

const ITEMS = [0, 1, 2, 3, 4, 5] as const;

function FaqRow({
    index,
    question,
    answer,
    open,
    onToggle,
}: {
    index: number;
    question: string;
    answer: string;
    open: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="border-b border-border-subtle">
            <h3>
                <button
                    type="button"
                    onClick={onToggle}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-trigger-${index}`}
                    className="group flex w-full items-center justify-between gap-6 py-6 lg:py-7 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded-sm"
                    data-cursor="hover"
                >
                    <span className="text-heading text-[1.125rem] lg:text-[1.375rem] text-foreground group-hover:text-accent transition-colors duration-300">
                        {question}
                    </span>
                    <span
                        aria-hidden="true"
                        className={`relative shrink-0 w-5 h-5 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                    >
                        <span className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-foreground-muted group-hover:bg-accent transition-colors duration-300" />
                        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-foreground-muted group-hover:bg-accent transition-colors duration-300" />
                    </span>
                </button>
            </h3>
            <div
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-trigger-${index}`}
                aria-hidden={!open}
                className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.05,0,0.133,1)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
                <div className="overflow-hidden">
                    <p
                        className={`text-body-lg text-foreground-muted max-w-[64ch] pb-7 lg:pb-8 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
                    >
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
}

export function FaqSection() {
    const t = useTranslations("faq");
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="relative section-py bg-background" id="faq">
            <div className="section-container grid-container gap-y-12">
                <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-32 lg:self-start space-y-6">
                    <span className="text-index text-foreground-subtle">{t("label")}</span>
                    <TextReveal as="h2" type="lines" className="text-title">
                        {t("title")}
                    </TextReveal>
                </div>

                <div className="col-span-12 lg:col-start-6 lg:col-span-7">
                    {ITEMS.map((i) => (
                        <FaqRow
                            key={i}
                            index={i}
                            question={t(`q${i}`)}
                            answer={t(`a${i}`)}
                            open={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
