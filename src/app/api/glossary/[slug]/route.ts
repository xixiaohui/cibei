import { NextRequest, NextResponse } from "next/server";
import { getGlossaryBySlug } from "@/lib/glossary";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const term = await getGlossaryBySlug(slug);
  if (!term) {
    return NextResponse.json({ error: "词条未找到" }, { status: 404 });
  }
  return NextResponse.json(term);
}
