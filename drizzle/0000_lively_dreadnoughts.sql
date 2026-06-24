CREATE TABLE "encyclopedia" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"category" text,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "encyclopedia_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "glossary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"term" text NOT NULL,
	"term_en" text,
	"term_sanskrit" text,
	"definition" text NOT NULL,
	"related_terms" text[],
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "glossary_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sutras" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"title_en" text,
	"dynasty" text,
	"translator" text,
	"summary" text,
	"category" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "sutras_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
