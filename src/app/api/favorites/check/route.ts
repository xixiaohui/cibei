import { NextRequest, NextResponse } from "next/server";
import { isFavorited } from "@/lib/favorites-actions";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const slug = searchParams.get("slug");

  if (!type || !slug) {
    return NextResponse.json({ error: "缺少必填参数：type, slug" }, { status: 400 });
  }

  const validTypes = ["sutra", "glossary", "story", "encyclopedia"];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: `无效的 type，允许的值：${validTypes.join(", ")}` }, { status: 400 });
  }

  const favorited = await isFavorited(type as "sutra" | "glossary" | "story" | "encyclopedia", slug);
  return NextResponse.json({ favorited });
}
