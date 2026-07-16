import type { ServiceSlug } from "@/lib/services";

type ServiceSymbolProps = {
    slug: ServiceSlug | string;
    size?: "sm" | "md" | "lg";
    className?: string;
    tone?: "violet" | "warm";
    variant?: "orbital" | "ghost";
};

const SIZE_CLASS = {
    sm: "h-10 w-10",
    md: "h-14 w-14 lg:h-[4.5rem] lg:w-[4.5rem]",
    lg: "h-12 w-12 lg:h-16 lg:w-16",
};

const IMAGE_SIZE = {
    sm: "40px",
    md: "72px",
    lg: "64px",
};

export function ServiceSymbol({ slug, size = "md", className, tone = "violet", variant = "orbital" }: ServiceSymbolProps) {
    const cls = className ? `${SIZE_CLASS[size]} ${className}` : SIZE_CLASS[size];
    const isWarm = tone === "warm";
    const isGhost = variant === "ghost";

    return (
        <div className={`relative shrink-0 ${cls}`} aria-hidden>
            {!isGhost ? (
                <>
                    <span
                        className={`absolute inset-0 rounded-full border opacity-55 transition-all duration-500 ${
                            isWarm ? "border-accent-warm/25 group-hover:border-accent-warm/38" : "border-border-bright/45 group-hover:border-accent/50"
                        }`}
                    />
                    <span
                        className={`absolute inset-[17%] rounded-full border opacity-60 transition-all duration-500 ${
                            isWarm ? "border-accent-warm/14 group-hover:border-accent-warm/24" : "border-border-subtle/70 group-hover:border-accent/35"
                        }`}
                    />
                    <span
                        className={`absolute -inset-3 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100 ${
                            isWarm ? "bg-[radial-gradient(circle,var(--glow-warm),transparent_66%)]" : "bg-[radial-gradient(circle,var(--glow),transparent_66%)]"
                        }`}
                    />
                </>
            ) : null}
            <span
                className={`absolute inset-[20%] transition-all duration-500 ${
                    isGhost
                        ? "bg-foreground/18 opacity-100 group-hover:bg-accent-warm/24"
                        : isWarm
                          ? "bg-accent-warm/72 opacity-78 group-hover:bg-foreground group-hover:opacity-100"
                          : "bg-foreground opacity-78 group-hover:bg-accent-bright group-hover:opacity-100"
                }`}
                style={{
                    WebkitMaskImage: `url(/marketing/services/${slug}.svg)`,
                    maskImage: `url(/marketing/services/${slug}.svg)`,
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    WebkitMaskSize: IMAGE_SIZE[size],
                    maskSize: IMAGE_SIZE[size],
                }}
            />
        </div>
    );
}
