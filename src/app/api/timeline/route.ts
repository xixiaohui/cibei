import { NextResponse } from "next/server";
import { getAllTimelineEvents } from "@/lib/timeline";

export async function GET() {
  const events = await getAllTimelineEvents();
  return NextResponse.json(events);
}
