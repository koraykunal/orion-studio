"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary for the marketing site.
 *
 * There was no error.tsx anywhere in the app, so a thrown error in a server
 * component produced a bare 500 with no recovery path, and a client-side throw
 * produced a blank page. The copy is deliberately plain: an error screen is not
 * the place for tone of voice.
 */
export default function SiteError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        // Replace with a real reporter before relying on this.
        console.error("Unhandled error in a marketing route:", error);
    }, [error]);

    return (
        <main id="main-content" className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
            <p className="text-label text-foreground-subtle">Something went wrong</p>
            <h1 className="max-w-[20ch] text-title text-foreground">This page could not be loaded.</h1>
            <p className="max-w-[52ch] text-body-lg text-foreground-muted">
                The problem has been logged. You can try again, or head back to the home page.
            </p>
            {error.digest ? (
                <p className="text-caption text-foreground-subtle">Reference: {error.digest}</p>
            ) : null}
            <div className="flex flex-wrap items-center justify-center gap-3">
                <Button onClick={reset}>Try again</Button>
                <Button variant="ghost" onClick={() => router.push("/")}>
                    Go to the home page
                </Button>
            </div>
        </main>
    );
}
