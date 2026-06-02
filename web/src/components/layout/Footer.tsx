"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "next-view-transitions";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { OrionMark } from "@/components/effects/OrionMark";
import { SocialIcon } from "@/components/common/SocialIcon";
import { EASES, DURATIONS, STAGGER } from "@/lib/animations/config";
import { FOOTER_SOCIALS as socials, CONTACT_EMAIL } from "@/lib/socials";

export function Footer() {
    const locale = useLocale();
    const t = useTranslations("footer");
    const footerRef = useRef<HTMLElement>(null);
    const topRef = useRef<HTMLDivElement>(null);
    const colRefs = useRef<(HTMLDivElement | null)[]>([]);
    const bottomBarRef = useRef<HTMLDivElement>(null);
    const brandRef = useRef<HTMLDivElement>(null);

    const navLinks = [
        { labelKey: "navServices", href: `/${locale}/services` },
        { labelKey: "navWork",    href: `/${locale}/work` },
        { labelKey: "navBlog",    href: `/${locale}/blog` },
        { labelKey: "navProcess", href: `/${locale}/#process` },
        { labelKey: "navContact", href: `/${locale}/contact` },
    ];

    useGSAP(() => {
        if (!footerRef.current) return;

        colRefs.current.forEach((col, i) => {
            if (!col) return;
            gsap.fromTo(col,
                { opacity: 0, y: 32, filter: "blur(4px)" },
                {
                    opacity: 1, y: 0, filter: "blur(0px)",
                    duration: DURATIONS.slow, ease: EASES.expo,
                    delay: i * STAGGER.loose,
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 90%",
                        toggleActions: "play none none none",
                    },
                }
            );
        });

        if (bottomBarRef.current) {
            gsap.fromTo(bottomBarRef.current,
                { opacity: 0, y: 16 },
                {
                    opacity: 1, y: 0, duration: DURATIONS.base, ease: EASES.expo,
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 90%",
                        toggleActions: "play none none none",
                    },
                }
            );
        }

        if (brandRef.current) {
            gsap.fromTo(brandRef.current,
                { opacity: 0, y: 80, filter: "blur(10px)", scale: 0.95 },
                {
                    opacity: 1, y: 0, filter: "blur(0px)", scale: 1,
                    duration: 1.4, ease: EASES.brand,
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 95%",
                        toggleActions: "play none none none",
                    },
                }
            );
        }
    }, { scope: footerRef });

    return (
        <footer ref={footerRef} className="relative bg-background overflow-hidden">
            <div className="absolute -right-[8%] top-[5%] w-[40%] h-[60%] pointer-events-none">
                <OrionMark variant="full" lineOpacity={0.05} globalOpacity={0.3} rotate={20} />
            </div>

            <div ref={topRef} className="section-container pt-16 lg:pt-24 pb-20 lg:pb-28">
                <div className="grid-container gap-y-10">
                    <div
                        ref={(el) => { colRefs.current[0] = el; }}
                        className="col-span-4 md:col-span-4 lg:col-span-4"
                    >
                        <p className="text-body-lg text-foreground-muted max-w-[28ch]">
                            {t("tagline")}
                        </p>
                    </div>

                    <div
                        ref={(el) => { colRefs.current[1] = el; }}
                        className="col-span-2 md:col-span-2 lg:col-span-2 lg:col-start-7"
                    >
                        <p className="text-label text-foreground-subtle mb-5">{t("navigate")}</p>
                        <ul className="space-y-3">
                            {navLinks.map((link) => (
                                <li key={link.labelKey}>
                                    <Link
                                        href={link.href}
                                        className="text-body-lg text-foreground-muted hover:text-foreground transition-colors duration-300"
                                        data-cursor="hover"
                                    >
                                        {t(link.labelKey as "navServices" | "navWork" | "navBlog" | "navAbout" | "navProcess" | "navContact")}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div
                        ref={(el) => { colRefs.current[2] = el; }}
                        className="col-span-2 md:col-span-2 lg:col-span-2"
                    >
                        <p className="text-label text-foreground-subtle mb-5">{t("social")}</p>
                        <div className="flex items-center gap-5">
                            {socials.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={link.label}
                                    className="text-foreground-muted hover:text-foreground transition-colors duration-300"
                                    data-cursor="hover"
                                >
                                    <SocialIcon name={link.icon} size={22} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div
                        ref={(el) => { colRefs.current[3] = el; }}
                        className="col-span-4 md:col-span-2 lg:col-span-2"
                    >
                        <p className="text-label text-foreground-subtle mb-5">{t("getInTouch")}</p>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href={`mailto:${CONTACT_EMAIL}`}
                                    className="text-body-lg text-foreground-muted hover:text-foreground transition-colors duration-300"
                                    data-cursor="hover"
                                >
                                    {CONTACT_EMAIL}
                                </a>
                            </li>
                            <li>
                                <Link
                                    href={`/${locale}/contact`}
                                    className="text-body-lg text-foreground-muted hover:text-foreground transition-colors duration-300"
                                    data-cursor="hover"
                                >
                                    {t("bookCall")}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="w-full overflow-hidden">
                <div ref={brandRef} className="select-none pointer-events-none px-4">
                    <p
                        className="font-(--font-rh-display) leading-[0.85] tracking-[-0.04em] text-foreground/4 whitespace-nowrap text-center"
                        style={{ fontSize: "clamp(3rem, 14vw, 18rem)" }}
                    >
                        ORION STUDIO
                    </p>
                </div>
            </div>

            <div ref={bottomBarRef} className="section-container mt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:pb-[max(2rem,env(safe-area-inset-bottom))]">
                <div className="flex items-center justify-between gap-4 py-5 border-t border-border-subtle">
                    <p className="text-caption">
                        &copy; {new Date().getFullYear()} Orion Studio
                    </p>
                    <p className="text-caption text-foreground-subtle">
                        {t("crafted")}
                    </p>
                </div>
            </div>
        </footer>
    );
}
