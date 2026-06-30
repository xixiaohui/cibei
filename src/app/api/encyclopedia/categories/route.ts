import { NextResponse } from "next/server";
import { getEncyclopediaCategories } from "@/lib/encyclopedia";

export async function GET() {
  const categories = await getEncyclopediaCategories();
  return NextResponse.json(categories);
}
