"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { favorites } from "@/db/schema/favorites";
import { and, eq } from "drizzle-orm";

export type FavoriteType = "sutra" | "glossary" | "story";

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
}

export async function toggleFavorite(type: FavoriteType, slug: string, title: string, subtitle?: string) {
  const userId = await getUserId();
  if (!userId) return { favorited: false, error: "请先登录" };

  const existing = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.type, type), eq(favorites.slug, slug)))
    .limit(1);

  if (existing.length > 0) {
    await db.delete(favorites).where(eq(favorites.id, existing[0].id));
    revalidatePath("/favorites");
    return { favorited: false };
  }

  await db.insert(favorites).values({ userId, type, slug, title, subtitle });
  revalidatePath("/favorites");
  return { favorited: true };
}

export async function isFavorited(type: FavoriteType, slug: string) {
  const userId = await getUserId();
  if (!userId) return false;

  const result = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.type, type), eq(favorites.slug, slug)))
    .limit(1);

  return result.length > 0;
}

export async function getUserFavorites() {
  const userId = await getUserId();
  if (!userId) return [];

  return db
    .select()
    .from(favorites)
    .where(eq(favorites.userId, userId))
    .orderBy(favorites.createdAt);
}
