import { NextRequest, NextResponse } from "next/server";
import { getLearningPathBySlug, getPathSteps } from "@/lib/learning-paths";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const path = await getLearningPathBySlug(slug);
  if (!path) {
    return NextResponse.json({ error: "学习路径未找到" }, { status: 404 });
  }
  const steps = await getPathSteps(path.id);
  return NextResponse.json({ path, steps });
}
