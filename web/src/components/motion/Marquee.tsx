"use client";

interface MarqueeProps {
    items: string[];
    speed?: number;
    separator?: "dot" | "star" | "dash";
    className?: string;
}

function TrackContent({ items, sep }: { items: string[]; sep: string }) {
    return (
        <>
            {items.map((item, i) => (
                <span
                    key={i}
                    className="flex items-center gap-6 shrink-0 px-6 py-4 text-label text-foreground-muted whitespace-nowrap"
                >
                    {item}
                    <span className="text-foreground-subtle text-[0.5rem]">{sep}</span>
                </span>
            ))}
        </>
    );
}

export function Marquee({
    items,
    speed = 30,
    separator = "dot",
    className,
}: MarqueeProps) {
    const sep =
        separator === "star" ? "\u2726" : separator === "dash" ? "\u2014" : "\u2022";

    const repeated = [...items, ...items, ...items, ...items];
    const duration = Math.max(12, (repeated.length * 1.5) / (speed / 10));

    return (
        <div className={`overflow-hidden ${className ?? ""}`}>
            <div
                className="flex w-fit ticker-track will-change-transform"
                style={{ animationDuration: `${duration}s` }}
            >
                <div className="flex shrink-0">
                    <TrackContent items={repeated} sep={sep} />
                </div>
                <div className="flex shrink-0" aria-hidden="true">
                    <TrackContent items={repeated} sep={sep} />
                </div>
            </div>
        </div>
    );
}
