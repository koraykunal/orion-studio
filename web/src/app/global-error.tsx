"use client";

/**
 * Last-resort boundary for the whole app.
 *
 * Renders outside the site chrome on purpose: if the root layout or the
 * provider tree has thrown, wrapping the output in Navbar and Footer would
 * throw again and produce a blank page.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <html lang="en" className="dark">
            <body className="flex min-h-svh items-center justify-center bg-background px-6 text-center">
                <main className="flex max-w-[52ch] flex-col items-center gap-5">
                    <h1 className="text-title text-foreground">The site failed to load.</h1>
                    <p className="text-body-lg text-foreground-muted">
                        An unexpected error occurred before the page could be rendered.
                    </p>
                    {error.digest ? (
                        <p className="text-caption text-foreground-subtle">Reference: {error.digest}</p>
                    ) : null}
                    <button
                        type="button"
                        onClick={reset}
                        className="text-label border-b border-border pb-1 text-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                        Reload
                    </button>
                </main>
            </body>
        </html>
    );
}
