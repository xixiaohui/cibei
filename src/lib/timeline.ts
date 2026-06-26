import { db } from "@/db";
import { timelineEvents } from "@/db/schema/timeline-events";
import { asc } from "drizzle-orm";

export async function getAllTimelineEvents() {
  return db.select().from(timelineEvents).orderBy(asc(timelineEvents.year));
}
