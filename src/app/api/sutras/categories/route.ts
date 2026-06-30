import { NextResponse } from "next/server";
import { getSutraCategories } from "@/lib/sutras";

export async function GET() {
  const categories = await getSutraCategories();
  return NextResponse.json(categories);
}
