CREATE TYPE "ProjectServiceCategory" AS ENUM (
  'identity',
  'web',
  'apps',
  'seo',
  'social',
  'ads',
  'production',
  'care'
);

ALTER TABLE "Project"
ADD COLUMN "serviceCategory" "ProjectServiceCategory" NOT NULL DEFAULT 'web';
