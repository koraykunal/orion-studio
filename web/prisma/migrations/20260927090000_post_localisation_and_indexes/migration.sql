-- Post localisation: description was the only editorial field left without a
-- per-locale pair, so /tr rendered an English meta description and standfirst
-- above a Turkish body.
--
-- description is intentionally kept. Existing rows and any external consumer
-- still read it, and it acts as the default-locale fallback.
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "description_en" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "description_tr" TEXT;

-- Backfill the new English column from the legacy single-locale value so no
-- published post loses its meta description.
UPDATE "Post" SET "description_en" = "description" WHERE "description_en" = '' AND "description" <> '';

-- Foreign keys are not indexed automatically in Postgres. Post.authorId is
-- ON DELETE RESTRICT, which is checked on every user delete.
CREATE INDEX IF NOT EXISTS "Post_authorId_idx" ON "Post"("authorId");

-- The public blog index filters on status and orders by publishedAt desc.
CREATE INDEX IF NOT EXISTS "Post_status_publishedAt_idx" ON "Post"("status", "publishedAt" DESC);

-- Covers the three public project reads and the admin ordering query.
CREATE INDEX IF NOT EXISTS "Project_status_order_idx" ON "Project"("status", "order");
CREATE INDEX IF NOT EXISTS "Project_featured_idx" ON "Project"("featured");
CREATE INDEX IF NOT EXISTS "Project_serviceCategory_idx" ON "Project"("serviceCategory");

-- Admin messages list: filter by workflow state, newest first.
CREATE INDEX IF NOT EXISTS "Message_status_createdAt_idx" ON "Message"("status", "createdAt" DESC);

-- RateLimitBucket.resetAt was indexed by the 20260715 migration but never
-- declared in schema.prisma, so the next `migrate dev` would have emitted a
-- DROP INDEX for it. The opportunistic sweep in lib/rate-limit.ts deletes on
-- this column, so the index has to be part of the declared schema.
CREATE INDEX IF NOT EXISTS "RateLimitBucket_resetAt_idx" ON "RateLimitBucket"("resetAt");
