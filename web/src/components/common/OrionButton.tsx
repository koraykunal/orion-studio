import type { MouseEvent, ReactNode } from "react";
import { Link } from "next-view-transitions";
import { ArrowUpRight } from "./ArrowUpRight";

type OrionButtonVariant = "pill" | "primary" | "ghost" | "underline";

type OrionButtonProps = {
    children: ReactNode;
    href?: string;
    onClick?: (e: MouseEvent<HTMLElement>) => void;
    type?: "button" | "submit";
    disabled?: boolean;
    variant?: OrionButtonVariant;
    withArrow?: boolean;
    external?: boolean;
    className?: string;
    "aria-label"?: string;
};

const PILL_CLASS =
    "group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-border-bright bg-surface-2 text-label text-foreground hover:border-accent hover:text-accent transition-all duration-500 overflow-hidden whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed";

const PRIMARY_CLASS =
    "group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-accent text-accent-foreground text-label hover:bg-accent-bright transition-all duration-500 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed";

const GHOST_CLASS =
    "group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-border-bright bg-background/40 backdrop-blur-sm text-label text-foreground hover:text-accent hover:border-accent transition-all duration-500 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed";

const UNDERLINE_CLASS =
    "group inline-flex items-center gap-3 text-label border-b border-border pb-1 hover:border-accent transition-colors duration-300";

const VARIANT_CLASS: Record<OrionButtonVariant, string> = {
    pill: PILL_CLASS,
    primary: PRIMARY_CLASS,
    ghost: GHOST_CLASS,
    underline: UNDERLINE_CLASS,
};

function PillInner({ children, withArrow }: { children: ReactNode; withArrow?: boolean }) {
    return (
        <>
            <span className="relative z-10 inline-flex items-center gap-3">
                {children}
                {withArrow && (
                    <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                )}
            </span>
            <span
                aria-hidden="true"
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,var(--glow)_0%,transparent_70%)]"
            />
        </>
    );
}

function PlainInner({ children, withArrow }: { children: ReactNode; withArrow?: boolean }) {
    return (
        <>
            {children}
            {withArrow && (
                <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
        </>
    );
}

export function OrionButton({
    children,
    href,
    onClick,
    type = "button",
    disabled,
    variant = "pill",
    withArrow = false,
    external = false,
    className,
    "aria-label": ariaLabel,
}: OrionButtonProps) {
    const base = VARIANT_CLASS[variant];
    const cls = className ? `${base} ${className}` : base;
    const Inner = variant === "pill" ? PillInner : PlainInner;
    const content = <Inner withArrow={withArrow}>{children}</Inner>;

    if (href && !external && href.startsWith("/")) {
        return (
            <Link href={href} onClick={onClick} className={cls} data-cursor="hover" aria-label={ariaLabel}>
                {content}
            </Link>
        );
    }

    if (href) {
        return (
            <a
                href={href}
                onClick={onClick}
                className={cls}
                data-cursor="hover"
                aria-label={ariaLabel}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={cls}
            data-cursor="hover"
            aria-label={ariaLabel}
        >
            {content}
        </button>
    );
}
