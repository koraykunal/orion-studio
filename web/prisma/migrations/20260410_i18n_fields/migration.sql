ALTER TABLE "Post" RENAME COLUMN "title" TO "title_en";
ALTER TABLE "Post" ADD COLUMN "title_tr" TEXT;
ALTER TABLE "Post" RENAME COLUMN "contentHtml" TO "contentHtml_en";
ALTER TABLE "Post" ADD COLUMN "contentHtml_tr" TEXT;

ALTER TABLE "Project" RENAME COLUMN "tagline" TO "tagline_en";
ALTER TABLE "Project" ADD COLUMN "tagline_tr" TEXT;
ALTER TABLE "Project" RENAME COLUMN "outcome" TO "outcome_en";
ALTER TABLE "Project" ADD COLUMN "outcome_tr" TEXT;
