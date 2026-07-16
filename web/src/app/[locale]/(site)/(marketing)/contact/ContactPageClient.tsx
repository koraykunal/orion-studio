"use client";

import { useRef, useState, useCallback, type FormEvent } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { OrionMark } from "@/components/effects/OrionMark";
import { OrionButton } from "@/components/common/OrionButton";
import { SocialIcon } from "@/components/common/SocialIcon";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations/config";
import { PRIMARY_SOCIALS as socials, CONTACT_EMAIL } from "@/lib/socials";

type ContactCopy = {
    pageLabel: string;
    pageTitle: string;
    pageDescription: string;
    directLabel: string;
    socialLabel: string;
    servicesLabel: string;
    servicesHint: string;
    budgetLabel: string;
    budgetHint: string;
    timelineLabel: string;
    timelineHint: string;
    fieldName: string;
    fieldNamePlaceholder: string;
    fieldCompany: string;
    fieldCompanyPlaceholder: string;
    fieldEmail: string;
    fieldEmailPlaceholder: string;
    fieldBrief: string;
    fieldBriefPlaceholder: string;
    fieldReferral: string;
    fieldReferralPlaceholder: string;
    submit: string;
    sending: string;
    successTitle: string;
    successBody: string;
    errorTitle: string;
    errorBody: string;
};

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
            aria-pressed={selected}
            className={`
                px-4 py-2.5 rounded-full text-label transition-all duration-300 cursor-pointer
                border select-none whitespace-nowrap
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background
                ${
                    selected
                        ? "border-accent bg-accent/10 text-accent shadow-[0_0_24px_var(--glow)]"
                        : "border-border-bright/70 bg-surface-1 text-foreground-readable hover:border-accent/60 hover:bg-surface-2 hover:text-foreground"
                }
            `}
        >
            {label}
        </button>
    );
}

export function ContactPageClient({
    copy,
    services,
    budgets,
    timelines,
}: {
    copy: ContactCopy;
    services: string[];
    budgets: string[];
    timelines: string[];
}) {
    const pageRef = useRef<HTMLElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

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
            if (window.matchMedia("(max-width: 767px)").matches) return;

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
                        "radial-gradient(ellipse 70% 60% at 30% 40%, var(--glow-subtle), transparent 70%)",
                }}
            />
            <div className="absolute -right-[15%] top-[20%] w-[50%] h-[60%] pointer-events-none">
                <OrionMark variant="shoulders" lineOpacity={0.04} globalOpacity={0.3} rotate={15} />
            </div>

            <div className="relative z-10 section-py pt-28 lg:pt-32">
                <div className="section-container">
                    <LineReveal className="mb-12 lg:mb-24" />
                </div>

                <div className="grid-container gap-y-12 lg:gap-y-16">
                    <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-32 lg:self-start space-y-6 lg:space-y-8">
                        <span className="text-index text-foreground-subtle">
                            {copy.pageLabel}
                        </span>

                        <TextReveal as="h1" type="words" className="text-title" disableOnMobile>
                            {copy.pageTitle}
                        </TextReveal>

                        <TextReveal
                            as="p"
                            type="lines"
                            className="text-body-lg text-foreground-readable max-w-[38ch]"
                            delay={0.15}
                            disableOnMobile
                        >
                            {copy.pageDescription}
                        </TextReveal>

                        <div className="space-y-6 pt-4">
                            <div className="divider-subtle" />

                            <div className="space-y-3">
                                <span className="text-label text-foreground-subtle block">
                                    {copy.directLabel}
                                </span>
                                <a
                                    href={`mailto:${CONTACT_EMAIL}`}
                                    className="text-body-lg text-foreground-readable hover:text-accent transition-colors duration-300 block"
                                    data-cursor="hover"
                                >
                                    {CONTACT_EMAIL}
                                </a>
                            </div>

                            <div className="space-y-3">
                                <span className="text-label text-foreground-subtle block">
                                    {copy.socialLabel}
                                </span>
                                <div className="flex items-center gap-5">
                                    {socials.map((s) => (
                                        <a
                                            key={s.label}
                                            href={s.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={s.label}
                                            className="text-foreground-readable hover:text-foreground transition-colors duration-300"
                                            data-cursor="hover"
                                        >
                                            <SocialIcon name={s.icon} size={22} />
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
                                    {copy.fieldName} <span className="text-accent">*</span>
                                </span>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder={copy.fieldNamePlaceholder}
                                    className="w-full bg-surface-1 border border-border rounded-lg px-5 py-4 text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-all duration-300"
                                />
                            </label>
                            <label className="space-y-3">
                                <span className="text-label text-foreground-muted block">
                                    {copy.fieldEmail} <span className="text-accent">*</span>
                                </span>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder={copy.fieldEmailPlaceholder}
                                    className="w-full bg-surface-1 border border-border rounded-lg px-5 py-4 text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-all duration-300"
                                />
                            </label>
                        </div>

                        <label className="form-field space-y-3 block">
                            <span className="text-label text-foreground-muted block">
                                {copy.fieldCompany}
                            </span>
                            <input
                                name="company"
                                type="text"
                                placeholder={copy.fieldCompanyPlaceholder}
                                className="w-full bg-surface-1 border border-border rounded-lg px-5 py-4 text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-all duration-300"
                            />
                        </label>

                        <fieldset className="form-field space-y-4">
                            <legend className="text-label text-foreground-readable">
                                {copy.servicesLabel}
                            </legend>
                            <p className="text-sm leading-relaxed text-foreground-subtle">
                                {copy.servicesHint}
                            </p>
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
                                <legend className="text-label text-foreground-readable">
                                    {copy.budgetLabel}
                                </legend>
                                <p className="text-sm leading-relaxed text-foreground-subtle">
                                    {copy.budgetHint}
                                </p>
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
                                <legend className="text-label text-foreground-readable">
                                    {copy.timelineLabel}
                                </legend>
                                <p className="text-sm leading-relaxed text-foreground-subtle">
                                    {copy.timelineHint}
                                </p>
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
                                {copy.fieldBrief} <span className="text-accent">*</span>
                            </span>
                            <textarea
                                name="brief"
                                required
                                rows={6}
                                placeholder={copy.fieldBriefPlaceholder}
                                className="w-full bg-surface-1 border border-border rounded-lg px-5 py-4 text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-all duration-300 resize-y min-h-[160px]"
                            />
                        </label>

                        <label className="form-field space-y-3 block">
                            <span className="text-label text-foreground-muted block">
                                {copy.fieldReferral}
                            </span>
                            <input
                                name="referral"
                                type="text"
                                placeholder={copy.fieldReferralPlaceholder}
                                className="w-full bg-surface-1 border border-border rounded-lg px-5 py-4 text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-all duration-300"
                            />
                        </label>

                        <div className="form-field pt-4 space-y-4">
                            <OrionButton type="submit" disabled={formStatus === "sending"}>
                                {formStatus === "sending" ? copy.sending : copy.submit}
                            </OrionButton>
                            {formStatus === "sent" && (
                                <p className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success" role="status" aria-live="polite">
                                    {copy.successTitle} {copy.successBody}
                                </p>
                            )}
                            {formStatus === "error" && (
                                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive" role="alert" aria-live="assertive">
                                    {copy.errorTitle} {copy.errorBody}
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
