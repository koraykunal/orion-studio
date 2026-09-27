import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * Lazily-constructed Prisma client.
 *
 * The client used to be created at module scope, which meant importing any
 * module that transitively touches the database opened a connection pool
 * immediately, and threw at import time when DATABASE_URL was absent. That
 * makes the module impossible to unit test and couples every route, including
 * ones that never query anything, to database availability.
 *
 * The exported object is a Proxy that forwards to the real client on first
 * property access, so call sites keep using `prisma` unchanged and the pool is
 * created exactly once, and only if something actually needs it.
 */

type PrismaHolder = { client: PrismaClient | null };

const globalForPrisma = globalThis as unknown as { __prisma?: PrismaHolder };

const holder: PrismaHolder = (globalForPrisma.__prisma ??= { client: null });

function intFromEnv(name: string, fallback: number): number {
    const parsed = Number.parseInt(process.env[name] ?? "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function createPrismaClient(): PrismaClient {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error(
            "DATABASE_URL is not set. Prisma 7 reads the connection string at runtime through the driver adapter.",
        );
    }

    const pool = new Pool({
        connectionString,
        // node-postgres defaults to 10, which is easy to exceed once a deploy
        // runs more than one replica. Made explicit so the ceiling matches what
        // the database plan actually allows.
        max: intFromEnv("DB_POOL_MAX", 10),
        idleTimeoutMillis: intFromEnv("DB_POOL_IDLE_TIMEOUT_MS", 30_000),
        connectionTimeoutMillis: intFromEnv("DB_POOL_CONNECTION_TIMEOUT_MS", 10_000),
    });

    // A pool-level error listener is required: an idle client that the server
    // drops emits 'error' on the pool, and with no listener that becomes an
    // unhandled event that takes the process down.
    pool.on("error", (error) => {
        console.error("Unexpected error on an idle PostgreSQL client:", error);
    });

    return new PrismaClient({ adapter: new PrismaPg(pool) });
}

function getClient(): PrismaClient {
    holder.client ??= createPrismaClient();
    return holder.client;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
    get(_target, property, receiver) {
        const client = getClient();
        const value = Reflect.get(client, property, receiver);
        return typeof value === "function" ? value.bind(client) : value;
    },
});

/** True once a client has actually been constructed. Used by tests. */
export function isPrismaInitialised(): boolean {
    return holder.client !== null;
}

/** Closes the pool. Called from the SIGTERM handler in lib/shutdown.ts. */
export async function disconnectPrisma(): Promise<void> {
    if (!holder.client) return;
    await holder.client.$disconnect();
    holder.client = null;
}
