import Link from "next/link";
import { db } from "@/db";
import { sutras } from "@/db/schema/sutras";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export async function DailySutra() {
  // Pick a pseudo-random sutra based on today's date (seeded)
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );

  const allSutras = await db.select().from(sutras).orderBy(sutras.title);
  const dailySutra = allSutras[dayOfYear % allSutras.length];

  if (!dailySutra) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">今日经典</h2>
        <p className="text-muted-foreground mt-2">每日推荐一部经典，开启你的研读之旅</p>
      </div>
      <Link href={`/sutras/${dailySutra.slug}`}>
        <Card className="hover:border-accent/30 transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-[family-name:var(--font-serif)]">
                  {dailySutra.title}
                </CardTitle>
                {dailySutra.titleEn && (
                  <CardDescription className="text-base mt-1">
                    {dailySutra.titleEn}
                  </CardDescription>
                )}
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-1" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-3">
              {dailySutra.dynasty && <Badge variant="outline">{dailySutra.dynasty}</Badge>}
              {dailySutra.translator && <Badge variant="outline">{dailySutra.translator}译</Badge>}
            </div>
            {dailySutra.summary && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {dailySutra.summary}
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    </section>
  );
}
