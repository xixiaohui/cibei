import { NextRequest, NextResponse } from "next/server";
import { getAllGlossaryTerms } from "@/lib/glossary";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const letter = searchParams.get("letter") ?? undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.max(1, parseInt(searchParams.get("pageSize") ?? "20", 10) || 20);

  const result = await getAllGlossaryTerms(letter, page, pageSize);
  return NextResponse.json(result);
}
