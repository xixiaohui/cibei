import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const stories = pgTable("stories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  category: text("category").notNull(),
  sourceSutra: text("source_sutra"),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  moral: text("moral"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
