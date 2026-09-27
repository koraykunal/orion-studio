# Orion Studio Web

Next.js marketing site and CMS for Orion Studio.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, `output: standalone`) |
| UI | React 19, Tailwind CSS v4 (CSS-first `@theme`), shadcn/ui primitives for the admin |
| Motion | GSAP 3.14 + Lenis, `prefers-reduced-motion` honoured throughout |
| Content | PostgreSQL via Prisma 7 with the `@prisma/adapter-pg` driver adapter |
| Auth | NextAuth v5 (credentials, JWT session) |
| i18n | next-intl 4, `en` and `tr`, locale-prefixed URLs |
| Edge | nginx + certbot, Docker Compose |

## Development

```bash
cd web
cp .env.example .env.local     # then fill it in
npm install
npm run db:generate
npm run dev
```

`DATABASE_URL` is the only value the app refuses to start without. A local
Postgres is not part of this repository; point the variable at your own
instance or a managed one.

### Optional: development content fallback

The seed creates one admin and one blog post, but no projects, so `/work` renders
empty. To develop against fixture content instead, set:

```
DEV_PROJECT_FALLBACK=1
```

This is opt-in rather than automatic. It used to fire on any empty result or
any thrown error whenever `NODE_ENV` was `development`, which made a genuinely
broken query indistinguishable from an empty table.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint, including the behavioural accessibility rules |
| `npm run typecheck` | `next typegen` then `tsc --noEmit` |
| `npm test` | Vitest unit tests |
| `npm run verify` | lint, typecheck, test, build — what CI runs |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:migrate` | `prisma migrate deploy` (production) |
| `npm run db:migrate:dev` | Create and apply a new migration (development) |
| `npm run db:seed` | Seed the first admin and the demo post |
| `npm run db:studio` | Prisma Studio |

## Environment

See `.env.example` for the annotated list. The values that matter most:

- `DATABASE_URL` — managed PostgreSQL. Use `?sslmode=require` off localhost.
- `AUTH_SECRET` — `openssl rand -base64 32`.
- `AUTH_TRUST_HOST=true` — **required** behind a reverse proxy. Without it
  Auth.js throws `UntrustedHost` on `/api/auth/*`.
- `NEXT_PUBLIC_SITE_URL` — canonical origin, used for metadata, hreflang, the
  sitemap, JSON-LD and IndexNow.
- `NEXT_PUBLIC_WHATSAPP` — digits only, powers the WhatsApp and `tel:` CTAs.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — consumed by `npm run db:seed` only. Minimum
  12 characters. Never committed.
- `SMTP_*` — contact form notification delivery.

`NEXT_PUBLIC_*` values are **inlined at build time**, not read at runtime. The
Dockerfile declares them as build args and `docker-compose.yml` passes them
through, so setting them in `env_file` alone is not enough: a build without them
produces a bundle with empty contact links and no error anywhere.

## Database

```bash
npm run db:generate      # after cloning or changing the schema
npm run db:migrate       # apply committed migrations
npm run db:seed          # create the first admin
```

`db:seed` is idempotent and non-destructive: it inserts the admin and the demo
post if they are missing and never overwrites an existing row, so re-running it
cannot revert an editor's changes.

## Deployment

`deploy.sh` runs on the server from a working copy:

```bash
cd /path/to/orion-studio
./deploy.sh
```

It preflights the environment file, snapshots the running image for rollback,
pulls, applies migrations **before** restarting the app, waits for
`/api/health` to report healthy, reloads nginx so it re-resolves the container
address, renews certificates if due, and smoke-tests the public routes. A failed
health check rolls back to the previous image automatically.

The Prisma CLI is a devDependency and is therefore not in the production image.
Migrations run from a dedicated `migrate` build target in the Dockerfile.

### Operations notes

- **No database service in docker-compose.** `DATABASE_URL` points at a managed
  instance, so backups, failover and connection limits live there. If you add one
  for local development, put it in a `docker-compose.override.yml`; a single
  file that defines the database for both environments is how a
  `docker compose down -v` on the wrong host destroys production data.
- **Backups.** `pg_dump` on a schedule and an export of the `uploads` volume are
  not automated by this repository. The uploads volume lives in
  `/var/lib/docker/volumes` on the host and is not covered by anything in git.
- **Certificates.** The `certbot` service renews every 12 hours. The
  `orion-studio.net` redirect block still needs a live certificate for that
  domain, or nginx will not start.

## Verification

`npm run verify` is the full local gate and matches CI:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit --audit-level=low
```

The dependency set is at zero known advisories. CI fails if that changes.
