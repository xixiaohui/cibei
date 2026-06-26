"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";

const fadeUp =
  "opacity-0 translate-y-3 [animation:fade-up_0.7s_ease-out_forwards]";

export function HomeHero() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-20 md:pt-40 md:py-32">
      <div className="max-w-3xl">
        {/* Brand */}
        <h1
          className="text-4xl md:text-7xl font-bold tracking-tight mb-8 font-[family-name:var(--font-serif)]"
          style={{ animationDelay: "0ms" }}
        >
          <span className={`inline-block ${fadeUp}`}>慈</span>
          <span className={`inline-block ${fadeUp}`} style={{ animationDelay: "80ms" }}>悲</span>
          <span className={`inline-block ${fadeUp}`} style={{ animationDelay: "160ms" }}>空</span>
          <span className={`inline-block ${fadeUp}`} style={{ animationDelay: "240ms" }}>间</span>
        </h1>

        {/* Slogan */}
        <p
          className={`text-2xl md:text-3xl text-accent font-medium mb-6 font-[family-name:var(--font-serif)] leading-relaxed ${fadeUp}`}
          style={{ animationDelay: "400ms" }}
        >
          深入经藏，智慧如海。
        </p>

        {/* Description */}
        <p
          className={`text-base md:text-lg text-muted-foreground mb-12 leading-relaxed text-nowrap ${fadeUp}`}
          style={{ animationDelay: "550ms" }}
        >
          研读佛经原文，探索术语名相，品读佛教故事，了解宗派传承与历史人物。
        </p>

        {/* CTA */}
        <div
          className={`flex flex-wrap gap-4 ${fadeUp}`}
          style={{ animationDelay: "700ms" }}
        >
          <Link href="/sutras">
            <Button size="lg" className="gap-2 px-6">
              <BookOpen className="h-5 w-5" />
              浏览经典
            </Button>
          </Link>
          <Link href="/stories">
            <Button variant="outline" size="lg" className="gap-2 px-6">
              佛经故事
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
