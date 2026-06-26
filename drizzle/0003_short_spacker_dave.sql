CREATE TABLE "timeline_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"year" integer NOT NULL,
	"year_display" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"location" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "timeline_events_slug_unique" UNIQUE("slug")
);
