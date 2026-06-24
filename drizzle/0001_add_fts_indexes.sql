CREATE INDEX IF NOT EXISTS idx_glossary_fts ON glossary USING gin(to_tsvector('simple', term || ' ' || coalesce(definition, '')));
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_encyclopedia_fts ON encyclopedia USING gin(to_tsvector('simple', title || ' ' || coalesce(content, '')));
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_sutras_fts ON sutras USING gin(to_tsvector('simple', title || ' ' || coalesce(summary, '')));
