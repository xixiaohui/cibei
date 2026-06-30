import { NextResponse } from "next/server";
import { getStoryCategories } from "@/lib/stories";

export async function GET() {
  const categories = await getStoryCategories();
  return NextResponse.json(categories);
}
