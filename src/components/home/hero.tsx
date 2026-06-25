import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";

export function HomeHero() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 font-[family-name:var(--font-serif)]">
          慈悲空间
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
          现代佛学研究与经典学习平台
        </p>
        <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed">
          深入经藏，智慧如海。探索大乘佛教经典原文，研习佛学术语，
          了解历史人物与宗派传承。
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/sutras">
            <Button size="lg" className="gap-2">
              <BookOpen className="h-5 w-5" />
              开始学习
            </Button>
          </Link>
          <Link href="/sutras">
            <Button variant="outline" size="lg" className="gap-2">
              浏览经典
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
