import { type Metadata } from "next";
import { generateSeo as generateSeoMeta, type SeoProps } from "@/lib/seo";

export type { SeoProps };

export function seoHead(props: SeoProps): Metadata {
  return generateSeoMeta(props);
}
