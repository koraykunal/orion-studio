ALTER TABLE "Project" DROP COLUMN "content",
DROP COLUMN "contentHtml",
ADD COLUMN     "sections" JSONB NOT NULL DEFAULT '[]';
