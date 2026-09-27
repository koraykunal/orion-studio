# syntax=docker/dockerfile:1.7
#
# Three-stage standalone build.
#
# Two things this file previously got wrong and must not regress:
#   1. NEXT_PUBLIC_* values are inlined at BUILD time by Next.js. Without the
#      ARGs below the WhatsApp and telephone CTAs compile to empty strings and
#      the site ships with dead contact links, with no error anywhere.
#   2. `prisma generate` needs DATABASE_URL because Prisma 7 keeps the
#      connection string out of schema.prisma and reads it from
#      prisma.config.ts, which validates it.

# Pin the base image. A floating tag means two builds of the same commit are
# not guaranteed to produce the same image.
ARG NODE_IMAGE=node:22-alpine

FROM ${NODE_IMAGE} AS base

FROM base AS deps
WORKDIR /app
# `npm ci` requires the lockfile to be in sync with package.json, which is also
# a useful gate: a stale lockfile fails the build rather than resolving silently.
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci


FROM base AS builder
WORKDIR /app

# NEXT_PUBLIC_* are substituted here, at build time, exactly as Next.js does.
# Pass them via `build.args` in docker-compose.yml.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_WHATSAPP
ARG AUTH_SECRET
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_WHATSAPP=${NEXT_PUBLIC_WHATSAPP}
ENV NEXT_TELEMETRY_DISABLED=1
# A placeholder is enough for codegen. It is never used to open a connection.
ENV DATABASE_URL=${DATABASE_URL:-postgresql://build:build@127.0.0.1:5432/build}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build


# ---------------------------------------------------------------------------
# Migration runner
# ---------------------------------------------------------------------------
# The Prisma CLI is a devDependency, so the production image does not contain
# it and `prisma migrate deploy` cannot be run from the running container.
# This stage carries just the CLI, the schema and the migrations directory so a
# deploy can migrate before the new code starts, without building the app.
FROM base AS migrate
WORKDIR /app
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY package.json prisma.config.ts ./
COPY prisma ./prisma
RUN npx prisma generate
CMD ["npx", "prisma", "migrate", "deploy"]


FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# The standalone server binds 0.0.0.0 rather than the container hostname.
ENV HOSTNAME=0.0.0.0

RUN apk add --no-cache tini

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Next's standalone tracing does not reliably include @swc/helpers, so it is
# copied explicitly. See the @swc/helpers override in package.json.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@swc/helpers ./node_modules/@swc/helpers

# sharp is a runtime dependency, not a devDependency, because next/image
# optimises at request time and node:alpine has no prebuilt fallback.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/sharp ./node_modules/sharp
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@img ./node_modules/@img

# Baked into the image so a fresh volume inherits the right ownership. An
# existing volume keeps its original owner, which is why deploy.sh chowns it.
RUN mkdir -p /app/public/uploads && chown nextjs:nodejs /app/public/uploads

USER nextjs
EXPOSE 3000

# Hits the app's own /api/health route, which is a real readiness check rather
# than "the process is listening".
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# tini reaps orphans and forwards SIGTERM, so the SIGTERM handler in
# src/instrumentation.ts gets to run and drain the Postgres pool.
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
