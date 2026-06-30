import { NextRequest, NextResponse } from "next/server";
import { getAllStories } from "@/lib/stories";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.max(1, parseInt(searchParams.get("pageSize") ?? "20", 10) || 20);

  const result = await getAllStories(category, page, pageSize);
  return NextResponse.json(result);
}
