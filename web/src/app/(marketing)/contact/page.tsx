"use client";

import { useRef, useState, useCallback, type FormEvent } from "react";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { OrionMark } from "@/components/effects/OrionMark";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations/config";

/* ── Data ── */

const services = [
    "Experience Strategy",
    "Web Engineering",
    "Visual Production",
    "Product Integration",
];

const budgets = ["< $10K", "$10K – $25K", "$25K – $50K", "$50K – $100K", "$100K+"];

const timelines = ["< 1 month", "1 – 3 months", "3 – 6 months", "6+ months", "Flexible"];

const socials = [
    { label: "Instagram", href: "https://www.instagram.com/orionstud.io/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/104592237" },
];

/* ── Chip component ── */

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

/* ── Page ── */

export default function ContactPage() {
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

    /* ── GSAP reveal for form fields ── */
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
            {/* Background effects */}
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

            {/* Content */}
            <div className="relative z-10 section-py pt-32">
                <div className="section-container">
                    <LineReveal className="mb-16 lg:mb-24" />
                </div>

                <div className="grid-container gap-y-16">
                    {/* ── Left column: Info (sticky) ── */}
                    <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-32 lg:self-start space-y-8">
                        <span className="text-index text-foreground-subtle">
                            Contact
                        </span>

                        <TextReveal as="h1" type="words" className="text-title">
                            Start a project
                        </TextReveal>

                        <TextReveal
                            as="p"
                            type="lines"
                            className="text-body-lg text-foreground-muted max-w-[38ch]"
                            delay={0.15}
                        >
                            Tell us about your vision. We&apos;ll reply within 48
                            hours with a tailored roadmap and estimate.
                        </TextReveal>

                        <div className="space-y-6 pt-4">
                            <div className="divider-subtle" />

                            <div className="space-y-3">
                                <span className="text-label text-foreground-muted block">
                                    Direct
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
                                    Social
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

                    {/* ── Right column: Form ── */}
                    <form
                        ref={formRef}
                        className="col-span-12 lg:col-start-6 lg:col-span-7 space-y-10"
                        onSubmit={handleSubmit}
                    >
                        {/* Name & Email row */}
                        <div className="form-field grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="space-y-3">
                                <span className="text-label text-foreground-muted block">
                                    Name <span className="text-accent">*</span>
                                </span>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Ada Lovelace"
                                    className="w-full bg-surface-1 border border-border rounded-lg px-5 py-4 text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-all duration-300"
                                />
                            </label>
                            <label className="space-y-3">
                                <span className="text-label text-foreground-muted block">
                                    Email <span className="text-accent">*</span>
                                </span>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="you@company.com"
                                    className="w-full bg-surface-1 border border-border rounded-lg px-5 py-4 text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-all duration-300"
                                />
                            </label>
                        </div>

                        {/* Company */}
                        <label className="form-field space-y-3 block">
                            <span className="text-label text-foreground-muted block">
                                Company / Organization
                            </span>
                            <input
                                name="company"
                                type="text"
                                placeholder="Acme Corp"
                                className="w-full bg-surface-1 border border-border rounded-lg px-5 py-4 text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-all duration-300"
                            />
                        </label>

                        {/* Services */}
                        <fieldset className="form-field space-y-4">
                            <legend className="text-label text-foreground-muted">
                                What do you need? <span className="text-foreground-muted/60">(select all that apply)</span>
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

                        {/* Budget & Timeline row */}
                        <div className="form-field grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <fieldset className="space-y-4">
                                <legend className="text-label text-foreground-muted">
                                    Budget range
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
                                    Timeline
                                </legend>
                                <div className="flex flex-wrap gap-3">
                                    {timelines.map((t) => (
                                        <Chip
                                            key={t}
                                            label={t}
                                            selected={selectedTimeline === t}
                                            onClick={() =>
                                                setSelectedTimeline(
                                                    selectedTimeline === t ? null : t
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            </fieldset>
                        </div>

                        {/* Project Brief */}
                        <label className="form-field space-y-3 block">
                            <span className="text-label text-foreground-muted block">
                                Project brief <span className="text-accent">*</span>
                            </span>
                            <textarea
                                name="brief"
                                required
                                rows={6}
                                placeholder="Describe your project goals, scope, current status, and any relevant context..."
                                className="w-full bg-surface-1 border border-border rounded-lg px-5 py-4 text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-all duration-300 resize-y min-h-[160px]"
                            />
                        </label>

                        {/* Referral */}
                        <label className="form-field space-y-3 block">
                            <span className="text-label text-foreground-muted block">
                                How did you hear about us?
                            </span>
                            <input
                                name="referral"
                                type="text"
                                placeholder="Referral, search, social media..."
                                className="w-full bg-surface-1 border border-border rounded-lg px-5 py-4 text-foreground placeholder:text-foreground-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-all duration-300"
                            />
                        </label>

                        {/* Submit */}
                        <div className="form-field pt-4 space-y-4">
                            <button
                                type="submit"
                                disabled={formStatus === "sending"}
                                className="group relative px-10 py-4 rounded-full border border-border-bright bg-surface-2 text-label text-foreground hover:border-accent hover:text-accent transition-all duration-500 cursor-pointer overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                                data-cursor="hover"
                            >
                                <span className="relative z-10">
                                    {formStatus === "sending" ? "Sending..." : "Send inquiry"}
                                </span>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,var(--glow)_0%,transparent_70%)]" />
                            </button>
                            {formStatus === "sent" && (
                                <p className="text-label text-green-400">
                                    Message sent successfully. We&apos;ll be in touch within 48 hours.
                                </p>
                            )}
                            {formStatus === "error" && (
                                <p className="text-label text-red-400">
                                    Something went wrong. Please try again or email us directly.
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
