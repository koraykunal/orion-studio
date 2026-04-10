"use client";

import { useRef, useState, useCallback, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { OrionMark } from "@/components/effects/OrionMark";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations/config";

const socials = [
    { label: "Instagram", href: "https://www.instagram.com/orionstud.io/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/104592237" },
];

function Chip({
    label,
    selected,
    onClick,
}: {
    label: string;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                px-4 py-2.5 rounded-full text-label transition-all duration-300 cursor-pointer
                border select-none whitespace-nowrap
                ${
                    selected
                        ? "border-accent bg-accent/10 text-accent shadow-[0_0_24px_var(--glow)]"
                        : "border-border bg-surface-1 text-foreground-muted hover:border-border-bright hover:bg-surface-2 hover:text-foreground"
                }
            `}
        >
            {label}
        </button>
    );
}

export default function ContactPage() {
    const t = useTranslations("contact");
    const pageRef = useRef<HTMLElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const services = [t("service0"), t("service1"), t("service2"), t("service3")];
    const budgets = [t("budget0"), t("budget1"), t("budget2"), t("budget3"), t("budget4")];
    const timelines = [t("timeline0"), t("timeline1"), t("timeline2"), t("timeline3"), t("timeline4")];

    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
    const [selectedTimeline, setSelectedTimeline] = useState<string | null>(null);
    const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    const toggleService = useCallback((service: string) => {
        setSelectedServices((prev) =>
            prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
        );
    }, []);

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormStatus("sending");

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.get("name"),
                    email: formData.get("email"),
                    company: formData.get("company"),
                    services: selectedServices,
                    budget: selectedBudget,
                    timeline: selectedTimeline,
                    brief: formData.get("brief"),
                    referral: formData.get("referral"),
                }),
            });

            if (!res.ok) throw new Error("Failed");
            setFormStatus("sent");
            form.reset();
            setSelectedServices([]);
            setSelectedBudget(null);
            setSelectedTimeline(null);
        } catch {
            setFormStatus("error");
        }
    }, [selectedServices, selectedBudget, selectedTimeline]);

    useGSAP(
        () => {
            if (!formRef.current) return;

            const fields = formRef.current.querySelectorAll(".form-field");

            gsap.set(fields, { opacity: 0, y: 32, filter: "blur(4px)" });

            gsap.to(fields, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: DURATIONS.slow,
                stagger: STAGGER.base,
                ease: EASES.brand,
                scrollTrigger: {
                    trigger: formRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            });
        },
        { scope: pageRef }
    );

    return (
        <main ref={pageRef} className="relative min-h-screen bg-background overflow-hidden">
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 60% at 30% 40%, oklch(0.72 0.15 295 / 0.04), transparent 70%)",
                }}
            />
            <div className="absolute -right-[15%] top-[20%] w-[50%] h-[60%] pointer-events-none">
                <OrionMark variant="shoulders" lineOpacity={0.04} globalOpacity={0.3} rotate={15} />
            </div>

            <div className="relative z-10 section-py pt-32">
                <div className="section-container">
                    <LineReveal className="mb-16 lg:mb-24" />
                </div>

                <div className="grid-container gap-y-16">
                    <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-32 lg:self-start space-y-8">
                        <span className="text-index text-foreground-subtle">
                            {t("pageLabel")}
                        </span>

                        <TextReveal as="h1" type="words" className="text-title">
                            {t("pageTitle")}
                        </TextReveal>

                        <TextReveal
                            as="p"
                            type="lines"
                            className="text-body-lg text-foreground-muted max-w-[38ch]"
                            delay={0.15}
                        >
                            {t("pageDescription")}
                        </TextReveal>

                        <div className="space-y-6 pt-4">
                            <div className="divider-subtle" />

                            <div className="space-y-3">
                                <span className="text-label text-foreground-muted block">
                                    {t("directLabel")}
                                </span>
                                <a
                                    href="mailto:koraykunal85@outlook.com"
                                    className="text-body-lg text-foreground-muted hover:text-accent transition-colors duration-300 block"
                                    data-cursor="hover"
                                >
                                    koraykunal85@outlook.com
                                </a>
                            </div>

                            <div className="space-y-3">
                                <span className="text-label text-foreground-muted block">
                                    {t("socialLabel")}
                                </span>
                                <div className="flex items-center gap-6">
                                    {socials.map((s) => (
                                        <a
                                            key={s.label}
                                            href={s.href}
                                            className="text-label text-foreground-muted hover:text-foreground transition-colors duration-300"
                                            data-cursor="hover"
                                        >
                                            {s.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <form
                        ref={formRef}
                        className="col-span-12 lg:col-start-6 lg:col-span-7 space-y-10"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-field grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="space-y-3">
                                <span className="text-label text-foreground-muted block">
                                    {t("fieldName")} <span className="text-accent">*</span>
                                </span>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder={t("fieldNamePlaceholder")}
                                    className="w-full bg-surface-1 border border-border rounded-lg px-5 py-4 text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-all duration-300"
                                />
                            </label>
                            <label className="space-y-3">
                                <span className="text-label text-foreground-muted block">
                                    {t("fieldEmail")} <span className="text-accent">*</span>
                                </span>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder={t("fieldEmailPlaceholder")}
                                    className="w-full bg-surface-1 border border-border rounded-lg px-5 py-4 text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-all duration-300"
                                />
                            </label>
                        </div>

                        <label className="form-field space-y-3 block">
                            <span className="text-label text-foreground-muted block">
                                {t("fieldCompany")}
                            </span>
                            <input
                                name="company"
                                type="text"
                                placeholder={t("fieldCompanyPlaceholder")}
                                className="w-full bg-surface-1 border border-border rounded-lg px-5 py-4 text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-all duration-300"
                            />
                        </label>

                        <fieldset className="form-field space-y-4">
                            <legend className="text-label text-foreground-muted">
                                {t("servicesLabel")}
                            </legend>
                            <div className="flex flex-wrap gap-3">
                                {services.map((service) => (
                                    <Chip
                                        key={service}
                                        label={service}
                                        selected={selectedServices.includes(service)}
                                        onClick={() => toggleService(service)}
                                    />
                                ))}
                            </div>
                        </fieldset>

                        <div className="form-field grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <fieldset className="space-y-4">
                                <legend className="text-label text-foreground-muted">
                                    {t("budgetLabel")}
                                </legend>
                                <div className="flex flex-wrap gap-3">
                                    {budgets.map((b) => (
                                        <Chip
                                            key={b}
                                            label={b}
                                            selected={selectedBudget === b}
                                            onClick={() =>
                                                setSelectedBudget(selectedBudget === b ? null : b)
                                            }
                                        />
                                    ))}
                                </div>
                            </fieldset>

                            <fieldset className="space-y-4">
                                <legend className="text-label text-foreground-muted">
                                    {t("timelineLabel")}
                                </legend>
                                <div className="flex flex-wrap gap-3">
                                    {timelines.map((tl) => (
                                        <Chip
                                            key={tl}
                                            label={tl}
                                            selected={selectedTimeline === tl}
                                            onClick={() =>
                                                setSelectedTimeline(
                                                    selectedTimeline === tl ? null : tl
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            </fieldset>
                        </div>

                        <label className="form-field space-y-3 block">
                            <span className="text-label text-foreground-muted block">
                                {t("fieldBrief")} <span className="text-accent">*</span>
                            </span>
                            <textarea
                                name="brief"
                                required
                                rows={6}
                                placeholder={t("fieldBriefPlaceholder")}
                                className="w-full bg-surface-1 border border-border rounded-lg px-5 py-4 text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-all duration-300 resize-y min-h-[160px]"
                            />
                        </label>

                        <label className="form-field space-y-3 block">
                            <span className="text-label text-foreground-muted block">
                                {t("fieldReferral")}
                            </span>
                            <input
                                name="referral"
                                type="text"
                                placeholder={t("fieldReferralPlaceholder")}
                                className="w-full bg-surface-1 border border-border rounded-lg px-5 py-4 text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-all duration-300"
                            />
                        </label>

                        <div className="form-field pt-4 space-y-4">
                            <button
                                type="submit"
                                disabled={formStatus === "sending"}
                                className="group relative px-10 py-4 rounded-full border border-border-bright bg-surface-2 text-label text-foreground hover:border-accent hover:text-accent transition-all duration-500 cursor-pointer overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                                data-cursor="hover"
                            >
                                <span className="relative z-10">
                                    {formStatus === "sending" ? t("sending") : t("submit")}
                                </span>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,var(--glow)_0%,transparent_70%)]" />
                            </button>
                            {formStatus === "sent" && (
                                <p className="text-label text-green-400">
                                    {t("successTitle")} {t("successBody")}
                                </p>
                            )}
                            {formStatus === "error" && (
                                <p className="text-label text-red-400">
                                    {t("errorTitle")} {t("errorBody")}
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
