"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface SutraExternalFilterProps {
  active: boolean;
}

export function SutraExternalFilter({ active }: SutraExternalFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function toggle() {
    const params = new URLSearchParams(searchParams.toString());
    if (active) {
      params.delete("external");
    } else {
      params.set("external", "1");
    }
    params.delete("page");
    router.push(`/sutras?${params.toString()}`);
  }

  return (
    <Badge
      variant={active ? "default" : "outline"}
      className="cursor-pointer gap-1"
      onClick={toggle}
    >
      <ExternalLink className="h-3 w-3" />
      有全文链接
    </Badge>
  );
}
