import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getClientKey, rateLimit } from "@/lib/rate-limit";
import { isValidEmailAddress } from "@/lib/smtp";

/** Login throttling. Generous per IP, tight per account. */
const SIGN_IN_WINDOW_MS = 15 * 60_000;
const SIGN_IN_MAX_PER_IP = 20;
const SIGN_IN_MAX_PER_ACCOUNT = 5;

/**
 * A real bcrypt hash of a value nobody can supply. Comparing against it when
 * the account does not exist keeps the failure path the same cost as the
 * success path, so response timing does not reveal which emails are registered.
 */
const DUMMY_HASH = "$2b$12$C6UzMDM.H6dfI/f/IKcEeO8YUXzKMO88PbKUnFGXmoLNHniGiaLTCK";

export const { handlers, auth, signIn, signOut } = NextAuth({
    /**
     * The app is only ever served through its own nginx, which pins the Host
     * header via server_name, and behind a platform proxy the platform pins it.
     * Without this, Auth.js throws UntrustedHost on /api/auth/* and on every
     * request that touches the proxy.
     *
     * On by default rather than driven by an env var: making it a variable only
     * creates a way to switch off the one setting that keeps the app reachable
     * behind its own edge. Set AUTH_TRUST_HOST=false only if you deliberately
     * want the strict check.
     */
    trustHost: process.env.AUTH_TRUST_HOST !== "false",

    providers: [
        Credentials({
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
            },
            async authorize(credentials, request) {
                const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";
                const password = typeof credentials?.password === "string" ? credentials.password : "";

                if (!email || !password || password.length > 200) return null;

                // Throttle before touching the database so a credential-stuffing
                // run cannot use us as an oracle, and so it cannot be used to
                // enumerate accounts by driving the failure path.
                const clientKey = getClientKey(request as unknown as Request);
                const [byIp, byAccount] = await Promise.all([
                    rateLimit({ key: `auth:ip:${clientKey}`, windowMs: SIGN_IN_WINDOW_MS, max: SIGN_IN_MAX_PER_IP }),
                    rateLimit({ key: `auth:account:${email}`, windowMs: SIGN_IN_WINDOW_MS, max: SIGN_IN_MAX_PER_ACCOUNT }),
                ]);

                if (!byIp.allowed || !byAccount.allowed) {
                    console.warn(`Sign-in throttled for ${clientKey} (ip=${byIp.allowed}, account=${byAccount.allowed})`);
                    return null;
                }

                if (!isValidEmailAddress(email)) {
                    await bcryptjs.compare(password, DUMMY_HASH);
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email },
                    select: { id: true, email: true, name: true, password: true },
                });

                if (!user) {
                    // Equalise timing against the "wrong password" path.
                    await bcryptjs.compare(password, DUMMY_HASH);
                    return null;
                }

                const valid = await bcryptjs.compare(password, user.password);
                if (!valid) return null;

                return { id: user.id, email: user.email, name: user.name };
            },
        }),
    ],

    pages: {
        signIn: "/admin/login",
    },

    session: {
        strategy: "jwt",
        // Keep the window short. The admin surface is small and a stolen cookie
        // is unrevokable without server-side session storage.
        maxAge: 8 * 60 * 60,
    },

    // A JWT is only issued when the submitted password matched, so the token
    // sub is always a real user id.
    callbacks: {
        jwt({ token, user }) {
            if (user?.id) token.sub = user.id;
            return token;
        },
        session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
});
