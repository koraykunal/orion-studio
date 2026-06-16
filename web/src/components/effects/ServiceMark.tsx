"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, DrawSVGPlugin, useGSAP } from "@/lib/animations/gsap";

export function ServiceMark({ slug, className }: { slug: string; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [markup, setMarkup] = useState("");

    useEffect(() => {
        let active = true;
        fetch(`/marketing/services/${slug}.svg`)
            .then((r) => r.text())
            .then((txt) => {
                if (!active) return;
                const cleaned = txt
                    .replace(/<mask[\s\S]*?<\/mask>/g, "")
                    .replace(/\smask="url\([^)]*\)"/g, "");
                setMarkup(cleaned);
            })
            .catch(() => {});
        return () => { active = false; };
    }, [slug]);

    useGSAP(() => {
        if (!markup || !ref.current) return;
        gsap.registerPlugin(DrawSVGPlugin);

        const svg = ref.current.querySelector("svg");
        if (svg) {
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
            svg.style.display = "block";
            svg.style.overflow = "visible";
        }

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const paths = ref.current.querySelectorAll("path");
        if (!paths.length) return;

        gsap.set(paths, { fill: "none", stroke: "var(--foreground)", strokeWidth: 1.3, strokeLinecap: "round" });

        if (reduce) {
            gsap.set(paths, { drawSVG: "100%" });
            return;
        }

        gsap.fromTo(
            paths,
            { drawSVG: "0%" },
            {
                drawSVG: "100%",
                duration: 2.4,
                stagger: 0.07,
                ease: "power1.inOut",
                delay: 0.35,
            }
        );
    }, { dependencies: [markup], scope: ref });

    return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: markup }} aria-hidden />;
}
