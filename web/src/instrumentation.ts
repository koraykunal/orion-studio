/**
 * Next.js calls `register()` once per server process, in both the Node.js and
 * Edge runtimes. Draining the Postgres pool on SIGTERM means a rolling deploy
 * does not sever in-flight queries: without it the container gets ten seconds
 * of grace period and anything still running is killed mid-query.
 *
 * The handler lives in lib/shutdown.ts and is imported dynamically so that
 * `process.on` never reaches the Edge bundle.
 */
export async function register(): Promise<void> {
    if (process.env.NEXT_RUNTIME !== "nodejs") return;

    const { registerShutdownHandlers } = await import("@/lib/shutdown");
    await registerShutdownHandlers();
}
