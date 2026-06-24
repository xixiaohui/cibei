export interface SeoProps {
  title: string;
  description: string;
  canonical: string;
  ogType?: "website" | "article";
  schema?: Record<string, unknown>;
}

export function generateSeo({
  title,
  description,
  canonical,
  ogType = "website",
  schema,
}: SeoProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cebei.space";

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}${canonical}` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${canonical}`,
      siteName: "慈悲空间",
      locale: "zh_Hans",
      type: ogType,
    },
    ...(schema && {
      other: {
        "schema:org": JSON.stringify(schema),
      },
    }),
  };
}
