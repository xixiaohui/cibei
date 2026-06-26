"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeFavorite } from "@/lib/favorites-actions";

export function RemoveFavoriteButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleRemove() {
    startTransition(async () => {
      await removeFavorite(id);
      router.refresh();
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleRemove}
      disabled={pending}
      className="h-7 w-7 shrink-0 text-muted-foreground/40 hover:text-red-500 transition-colors"
      title="取消收藏"
    >
      <X className="h-3.5 w-3.5" />
    </Button>
  );
}
