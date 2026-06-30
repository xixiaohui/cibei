import { NextResponse } from "next/server";
import { getAllLearningPaths } from "@/lib/learning-paths";

export async function GET() {
  const paths = await getAllLearningPaths();
  return NextResponse.json(paths);
}
