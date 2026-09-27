/**
 * Graceful shutdown handling.
 *
 * Kept out of instrumentation.ts so `process.on` is only present in the
 * Node.js bundle. The instrumentation module is also compiled for the Edge
 * runtime, where process events do not exist and the build warns about it.
 */
export async function registerShutdownHandlers(): Promise<void> {
    const { disconnectPrisma } = await import("@/lib/prisma");

    let shuttingDown = false;

    const shutdown = async (signal: NodeJS.Signals) => {
        if (shuttingDown) return;
        shuttingDown = true;
        console.log(`Received ${signal}, closing the database pool.`);
        try {
            await disconnectPrisma();
        } catch (error) {
            console.error("Failed to close the database pool cleanly:", error);
        }
    };

    for (const signal of ["SIGTERM", "SIGINT"] as const) {
        process.on(signal, () => {
            void shutdown(signal);
        });
    }
}
