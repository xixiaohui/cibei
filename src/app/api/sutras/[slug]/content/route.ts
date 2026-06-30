import { NextRequest, NextResponse } from "next/server";
import { getSutraBySlug } from "@/lib/sutras";
import { stripFrontmatter } from "@/lib/mdx";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Verify sutra exists in DB
  const sutra = await getSutraBySlug(slug);
  if (!sutra) {
    return NextResponse.json({ error: "经典未找到" }, { status: 404 });
  }

  // Read MDX file
  let content = "";
  try {
    const filePath = path.join(process.cwd(), "content", "sutras", `${slug}.mdx`);
    const raw = await readFile(filePath, "utf-8");
    content = stripFrontmatter(raw).trim();
  } catch {
    return NextResponse.json({ error: "正文文件不存在" }, { status: 404 });
  }

  return NextResponse.json({
    slug: sutra.slug,
    title: sutra.title,
    content,
    format: "markdown",
  });
}
