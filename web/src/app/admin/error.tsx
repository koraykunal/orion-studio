"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * Error boundary for the CMS. A failed save must not look like a lost page, and
 * an unauthenticated visitor must never see CMS chrome here.
 */
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const router = useRouter();

    useEffect(() => {
        console.error("Unhandled error in the admin panel:", error);
    }, [error]);

    return (
        <main className="flex min-h-svh flex-col items-center justify-center gap-5 bg-background px-6 text-center">
            <h1 className="text-title text-foreground">Something went wrong in the admin panel.</h1>
            <p className="max-w-[52ch] text-body-lg text-foreground-muted">
                Your changes were not saved. Try the action again.
            </p>
            {error.digest ? <p className="text-caption text-foreground-subtle">Reference: {error.digest}</p> : null}
            <div className="flex items-center gap-3">
                <Button onClick={reset}>Try again</Button>
                <Button variant="ghost" onClick={() => router.push("/admin")}>
                    Back to the dashboard
                </Button>
            </div>
        </main>
    );
}
