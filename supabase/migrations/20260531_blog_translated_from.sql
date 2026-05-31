-- Track which English source post a non-English row was translated from.
-- Purely additive — existing English rows remain NULL, which is correct
-- (they have no parent). Non-English drafts created by translate.ts point
-- back to their source post.
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS translated_from UUID REFERENCES blog_posts(id) ON DELETE SET NULL;

-- Helps "list English posts that don't have a Spanish translation yet"
-- query the admin panel makes on every page load.
CREATE INDEX IF NOT EXISTS idx_blog_posts_translated_from
  ON blog_posts(translated_from);

-- Helps the per-language fetch which always filters by slug + language.
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug_language
  ON blog_posts(slug, language);
