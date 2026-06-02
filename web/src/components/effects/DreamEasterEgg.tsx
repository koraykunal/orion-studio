"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SEQUENCE = "dream";
const VOW = "always, yours";

const STARS = [
    { top: "18%", left: "22%", delay: "0s", size: 2 },
    { top: "30%", left: "78%", delay: "0.4s", size: 3 },
    { top: "62%", left: "14%", delay: "0.9s", size: 2 },
    { top: "72%", left: "70%", delay: "0.2s", size: 2 },
    { top: "44%", left: "50%", delay: "1.2s", size: 1.5 },
    { top: "24%", left: "58%", delay: "0.7s", size: 2 },
    { top: "80%", left: "40%", delay: "1.5s", size: 2.5 },
    { top: "12%", left: "44%", delay: "1s", size: 1.5 },
];

export function DreamEasterEgg() {
    const [open, setOpen] = useState(false);
    const buffer = useRef("");

    const close = useCallback(() => setOpen(false), []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (open) {
                if (e.key === "Escape") close();
                return;
            }

            const target = e.target as HTMLElement | null;
            if (
                target &&
                (target.isContentEditable ||
                    target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA")
            ) {
                return;
            }

            if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return;

            const next = (buffer.current + e.key.toLowerCase()).slice(-SEQUENCE.length);
            buffer.current = next;

            if (next === SEQUENCE) {
                buffer.current = "";
                setOpen(true);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, close]);

    if (!open) return null;

    return (
        <div
            className="dream-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="28.11"
            onClick={close}
        >
            <div className="dream-stars" aria-hidden>
                {STARS.map((s, i) => (
                    <span
                        key={i}
                        className="dream-star"
                        style={{
                            top: s.top,
                            left: s.left,
                            width: `${s.size}px`,
                            height: `${s.size}px`,
                            animationDelay: s.delay,
                        }}
                    />
                ))}
            </div>
            <div className="dream-mark">
                <span className="dream-date">
                    28.11
                    <span className="dream-heart" aria-hidden>♡</span>
                </span>
                <span className="dream-vow">{VOW}</span>
            </div>
        </div>
    );
}
