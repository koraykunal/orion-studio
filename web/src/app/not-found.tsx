import Link from "next/link";

export default function NotFound() {
    return (
        <main id="main-content" className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
            <p className="text-label text-foreground-subtle">404</p>
            <h1 className="max-w-[24ch] text-title text-foreground">This page does not exist.</h1>
            <p className="max-w-[52ch] text-body-lg text-foreground-muted">
                The link may be out of date, or the page may have been moved.
            </p>
            <Link
                href="/"
                className="text-label border-b border-border pb-1 text-foreground transition-colors hover:border-accent hover:text-accent"
            >
                Go to the home page
            </Link>
        </main>
    );
}
