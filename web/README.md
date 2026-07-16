# Orion Studio Web

Next.js marketing site and admin CMS for Orion Studio.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` for local development. Required values:

- `DATABASE_URL`: PostgreSQL connection string used by Prisma.
- `AUTH_SECRET`: strong secret for NextAuth sessions.
- `NEXT_PUBLIC_SITE_URL`: canonical public origin, for example `https://orionstud.io`.
- `NEXT_PUBLIC_WHATSAPP`: public WhatsApp/phone number without formatting.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: contact form mail delivery.
- `INDEXNOW_KEY`: optional IndexNow key.

`NEXT_PUBLIC_SITE_URL` is the single source for metadata, canonical URLs, sitemap, robots, JSON-LD, and IndexNow. If it is missing, the app falls back to `https://orionstud.io`.

## Database

Generate the Prisma client:

```bash
npx prisma generate
```

Apply production migrations:

```bash
npx prisma migrate deploy
```

## Verification

```bash
npm run lint
npm audit --json
npm run build
```
