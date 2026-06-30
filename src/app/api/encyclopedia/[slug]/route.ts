import { NextRequest, NextResponse } from "next/server";
import { getEncyclopediaBySlug } from "@/lib/encyclopedia";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const entry = await getEncyclopediaBySlug(slug);
  if (!entry) {
    return NextResponse.json({ error: "百科条目未找到" }, { status: 404 });
  }
  return NextResponse.json(entry);
}
