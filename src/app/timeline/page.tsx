import { getAllTimelineEvents } from "@/lib/timeline";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { generateSeo } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSeo({
  title: "佛学时间线",
  description: "从佛陀涅槃至今的佛教史大事年表，涵盖人物、经典译出、宗派创立、历史事件，纵览两千五百年佛法传承。",
  canonical: "/timeline",
});

const CATEGORY_COLORS: Record<string, string> = {
  "人物": "bg-amber-50 text-amber-700 border-amber-200",
  "经典译出": "bg-blue-50 text-blue-700 border-blue-200",
  "宗派创立": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "历史事件": "bg-stone-50 text-stone-600 border-stone-200",
  "圣地": "bg-rose-50 text-rose-700 border-rose-200",
};

export default async function TimelinePage() {
  const events = await getAllTimelineEvents();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "佛学时间线" }]} />

      <header className="mb-16 mt-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-serif)]">
          佛学时间线
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          从佛陀涅槃至今，纵览两千五百年佛法传承——重要人物、经典翻译、宗派创立、历史事件。
        </p>
      </header>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border/60 md:-translate-x-px" />

        <div className="space-y-0">
          {events.map((event, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div
                key={event.id}
                className="relative pb-14 last:pb-0"
              >
                {/* Dot on the line */}
                <div className="absolute left-4 md:left-1/2 top-6 w-3 h-3 rounded-full bg-accent border-2 border-background -translate-x-1/2 z-10" />

                {/* Card */}
                <div
                  className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${
                    isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
                  }`}
                >
                  {/* Year */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-accent font-medium tabular-nums">
                      {event.yearDisplay}
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full border ${
                        CATEGORY_COLORS[event.category] || CATEGORY_COLORS["历史事件"]
                      }`}
                    >
                      {event.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-serif)]">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>

                  {/* Location */}
                  {event.location && (
                    <p className="text-xs text-muted-foreground/50 mt-2">
                      📍 {event.location}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
