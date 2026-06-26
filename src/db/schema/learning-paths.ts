import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";

export const learningPaths = pgTable("learning_paths", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: text("level").notNull(), // Beginner / Intermediate / Advanced
  levelLabel: text("level_label").notNull(), // e.g. "入门" / "进阶" / "深入"
  icon: text("icon").notNull(), // emoji for visual
  stepCount: integer("step_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const pathSteps = pgTable("path_steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  pathId: uuid("path_id").notNull().references(() => learningPaths.id),
  stepNumber: integer("step_number").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  guidance: text("guidance"), // learning guidance / tips
  relatedSutraSlugs: text("related_sutra_slugs").array(), // links to sutras
  relatedTermSlugs: text("related_term_slugs").array(), // links to glossary
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
