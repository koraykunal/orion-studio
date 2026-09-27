"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Accessible modal dialog.
 *
 * Both hand-rolled dialogs in this codebase previously had `role="dialog"` (or
 * nothing at all), a backdrop with an onClick, and no focus management: focus
 * stayed on the control that opened the overlay, Tab moved behind it, and the
 * only way out was clicking the backdrop or a button. This primitive moves
 * focus in on open, traps it while open, restores it to the trigger on close,
 * and closes on Escape and on backdrop click.
 *
 * The `ui/dialog.tsx` shadcn component was removed as dead code; this is the
 * replacement the codebase actually uses.
 */
export function Modal({
    open,
    onClose,
    label,
    children,
    className,
    panelClassName,
    closeLabel = "Close",
    showCloseButton = true,
}: {
    open: boolean;
    onClose: () => void;
    label: string;
    children: React.ReactNode;
    className?: string;
    panelClassName?: string;
    closeLabel?: string;
    showCloseButton?: boolean;
}) {
    const panelRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);

    const focusableIn = useCallback((root: HTMLElement) => {
        return Array.from(
            root.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
        ).filter((element) => element.offsetParent !== null || element === document.activeElement);
    }, []);

    useEffect(() => {
        if (!open) return;

        // Remember where focus came from so it can be handed back on close.
        triggerRef.current = document.activeElement as HTMLElement | null;

        const panel = panelRef.current;
        const first = panel ? focusableIn(panel)[0] : null;
        (first ?? panel)?.focus();

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.stopPropagation();
                onClose();
                return;
            }
            if (event.key !== "Tab" || !panel) return;

            const focusable = focusableIn(panel);
            if (focusable.length === 0) {
                event.preventDefault();
                return;
            }

            const firstElement = focusable[0]!;
            const lastElement = focusable[focusable.length - 1]!;
            const active = document.activeElement;

            if (event.shiftKey && (active === firstElement || !panel.contains(active))) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && active === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown, true);

        return () => {
            document.removeEventListener("keydown", onKeyDown, true);
            document.body.style.overflow = previousOverflow;
            triggerRef.current?.focus?.();
        };
    }, [open, onClose, focusableIn]);

    if (!open) return null;

    return (
        <div className={className ?? "fixed inset-0 z-50 flex items-center justify-center"}>
            {/**
             * The backdrop is a real button rather than a div with a click
             * handler, so it is reachable by keyboard and announced as the
             * dismiss control it is. The panel is a sibling, not a child, so
             * there is no click-to-dismiss propagation to suppress.
             */}
            <button
                type="button"
                aria-label={closeLabel}
                onClick={onClose}
                className="absolute inset-0 cursor-default"
                tabIndex={-1}
            />
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={label}
                tabIndex={-1}
                className={panelClassName}
            >
                {showCloseButton ? (
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-foreground-muted hover:text-foreground text-sm transition-colors"
                    >
                        {closeLabel}
                    </button>
                ) : null}
                {children}
            </div>
        </div>
    );
}
