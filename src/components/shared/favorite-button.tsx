"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFavorite, type FavoriteType } from "@/lib/favorites-actions";

interface FavoriteButtonProps {
  type: FavoriteType;
  slug: string;
  title: string;
  subtitle?: string;
  initialFavorited?: boolean;
}

export function FavoriteButton({
  type,
  slug,
  title,
  subtitle,
  initialFavorited = false,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleFavorite(type, slug, title, subtitle);
      if (result.error) {
        alert(result.error);
        return;
      }
      setFavorited(result.favorited);
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={pending}
      className={`gap-1.5 text-xs ${favorited ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"}`}
      title={favorited ? "取消收藏" : "加入收藏"}
    >
      <Heart className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} />
      {favorited ? "已收藏" : "收藏"}
    </Button>
  );
}
