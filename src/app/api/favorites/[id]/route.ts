import { NextRequest, NextResponse } from "next/server";
import { removeFavorite } from "@/lib/favorites-actions";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await removeFavorite(id);
  if (result.error) {
    return NextResponse.json(result, { status: 401 });
  }
  return NextResponse.json(result);
}
