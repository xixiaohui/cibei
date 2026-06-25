"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  type: "sutra" | "dictionary" | "encyclopedia" | "story";
  slug: string;
  label?: string;
}

export function ShareButton({ type, slug, label = "下载海报" }: ShareButtonProps) {
  const posterUrl = `/api/poster/${type}/${slug}`;

  function handleDownload() {
    // Open poster image in new tab for download
    window.open(posterUrl, "_blank");
  }

  return (
    <Button variant="outline" size="sm" className="gap-2" onClick={handleDownload}>
      <Download className="h-4 w-4" />
      {label}
    </Button>
  );
}
