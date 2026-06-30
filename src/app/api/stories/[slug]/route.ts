import { NextRequest, NextResponse } from "next/server";
import { getStoryBySlug } from "@/lib/stories";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) {
    return NextResponse.json({ error: "故事未找到" }, { status: 404 });
  }
  return NextResponse.json(story);
}
