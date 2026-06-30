import { NextRequest, NextResponse } from "next/server";
import { toggleFavorite, getUserFavorites } from "@/lib/favorites-actions";

export async function GET() {
  const favorites = await getUserFavorites();
  return NextResponse.json(favorites);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, slug, title, subtitle } = body;

    if (!type || !slug || !title) {
      return NextResponse.json({ error: "缺少必填字段：type, slug, title" }, { status: 400 });
    }

    const validTypes = ["sutra", "glossary", "story", "encyclopedia"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: `无效的 type，允许的值：${validTypes.join(", ")}` }, { status: 400 });
    }

    const result = await toggleFavorite(type, slug, title, subtitle);
    if (result.error) {
      return NextResponse.json(result, { status: 401 });
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }
}
