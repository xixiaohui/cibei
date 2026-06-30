import { NextRequest, NextResponse } from "next/server";
import { getSutraBySlug } from "@/lib/sutras";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const sutra = await getSutraBySlug(slug);
  if (!sutra) {
    return NextResponse.json({ error: "经典未找到" }, { status: 404 });
  }
  return NextResponse.json(sutra);
}
