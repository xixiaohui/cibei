import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const favorites = pgTable("favorites", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // "sutra" | "glossary" | "story"
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"), // extra info: category, sanskrit, etc.
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
