CREATE TABLE "stories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"title_en" text,
	"category" text NOT NULL,
	"source_sutra" text,
	"summary" text NOT NULL,
	"content" text NOT NULL,
	"moral" text,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "stories_slug_unique" UNIQUE("slug")
);
