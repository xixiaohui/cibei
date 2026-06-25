import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getSutraBySlug } from "@/lib/sutras";
import { getGlossaryBySlug } from "@/lib/glossary";
import { getEncyclopediaBySlug } from "@/lib/encyclopedia";
import { getStoryBySlug } from "@/lib/stories";
import { stripFrontmatter } from "@/lib/mdx";
import { readFile, writeFile, access } from "fs/promises";
import path from "path";

// Note: using Node.js runtime (not edge) because Drizzle ORM requires it.
// ImageResponse from next/og works in both runtimes.

const TYPE_CONFIG: Record<string, { label: string; urlPrefix: string }> = {
  sutra: { label: "经典库", urlPrefix: "/sutras" },
  dictionary: { label: "佛学词典", urlPrefix: "/dictionary" },
  encyclopedia: { label: "佛学百科", urlPrefix: "/encyclopedia" },
  story: { label: "佛经故事", urlPrefix: "/stories" },
};

async function fetchData(type: string, slug: string) {
  switch (type) {
    case "sutra": {
      const d = await getSutraBySlug(slug);
      if (!d) return null;
      // Read MDX content and combine with summary
      let mdxBody = "";
      try {
        const filePath = path.join(process.cwd(), "content", "sutras", `${slug}.mdx`);
        const raw = await readFile(filePath, "utf-8");
        mdxBody = stripFrontmatter(raw).trim();
      } catch {
        // MDX not found, use summary only
      }
      const body = [d.summary, mdxBody].filter(Boolean).join("\n\n");
      return {
        title: d.title,
        subtitle: d.titleEn,
        body,
        meta: [d.dynasty, d.translator ? `${d.translator}译` : null].filter(Boolean) as string[],
      };
    }
    case "dictionary": {
      const d = await getGlossaryBySlug(slug);
      if (!d) return null;
      return {
        title: d.term,
        subtitle: d.termSanskrit || d.termEn || undefined,
        body: d.definition,
        meta: d.termEn ? [d.termEn] : [],
      };
    }
    case "encyclopedia": {
      const d = await getEncyclopediaBySlug(slug);
      if (!d) return null;
      return {
        title: d.title,
        subtitle: d.category || undefined,
        body: d.content,
        meta: [],
      };
    }
    case "story": {
      const d = await getStoryBySlug(slug);
      if (!d) return null;
      return {
        title: d.title,
        subtitle: d.sourceSutra ? `出自《${d.sourceSutra}》` : undefined,
        body: `${d.summary}\n\n${d.content || ""}`,
        meta: [d.category],
      };
    }
    default:
      return null;
  }
}

// Font file path — saved locally after first fetch
const FONT_PATH = path.join(process.cwd(), "public", "fonts", "NotoSerifSC-Regular.otf");

// Resolve the actual font URL from Google Fonts CSS API (URLs may change over time)
async function resolveFontUrl(): Promise<string> {
  const cssUrl =
    "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap";
  const cssRes = await fetch(cssUrl, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!cssRes.ok) throw new Error(`Font CSS fetch failed: ${cssRes.status}`);
  const css = await cssRes.text();
  const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/);
  if (!match) throw new Error("Could not parse font URL from CSS");
  return match[1];
}

// Helper: convert Node Buffer to proper ArrayBuffer (matching byteLength)
function toArrayBuffer(buf: Buffer): ArrayBuffer {
  const slice = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  // In Node.js, Buffer.buffer.slice always returns ArrayBuffer (not SharedArrayBuffer)
  return slice as unknown as ArrayBuffer;
}

// Load font: read from disk if cached, otherwise fetch from CDN and save locally.
// Returns the raw font buffer for use with Satori/ImageResponse.
async function loadFont(): Promise<ArrayBuffer> {
  try {
    await access(FONT_PATH);
    const buf = await readFile(FONT_PATH);
    if (buf.length > 1_000_000) return toArrayBuffer(buf) as ArrayBuffer;
    throw new Error("Cached font too small, re-downloading");
  } catch {
    const fontUrl = await resolveFontUrl();
    const res = await fetch(fontUrl);
    if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`);
    const arrayBuf = await res.arrayBuffer();
    await writeFile(FONT_PATH, Buffer.from(arrayBuf));
    console.log(`[poster] Font cached (${(arrayBuf.byteLength / 1024 / 1024).toFixed(1)}MB)`);
    return arrayBuf;
  }
}

// Cached font promise (in-memory, shared across requests in same process)
let fontPromise: Promise<ArrayBuffer> | null = null;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ type: string; slug: string }> }
) {
  const { type, slug } = await params;
  const config = TYPE_CONFIG[type];
  if (!config) {
    return new Response("Invalid type", { status: 400 });
  }

  const data = await fetchData(type, slug);
  if (!data) {
    return new Response("Not found", { status: 404 });
  }

  // Load font (with dedup across requests)
  if (!fontPromise) fontPromise = loadFont();
  const fontData = await fontPromise;

  // Clean body text: strip MDX markdown syntax, normalize whitespace
  const cleanBody = data.body
    .replace(/^#{1,3}\s+/gm, "")   // strip heading markers
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1")     // italic
    .replace(/^>\s+/gm, "")         // blockquote
    .replace(/`([^`]+)`/g, "$1")    // inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → text only
    .replace(/\n{3,}/g, "\n\n")     // collapse excessive newlines
    .trim();

  // Split into paragraphs, filter empty/single-char lines
  const bodyParagraphs = cleanBody
    .split("\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 2);

  // Limit total visible chars for balanced whitespace
  const MAX_PARAGRAPHS = 7;
  const MAX_CHARS_PER_PARAGRAPH = 72; // ~3 lines at 24 chars/line
  const MAX_TOTAL_CHARS = 400;

  let totalChars = 0;
  const visibleParagraphs: string[] = [];
  for (const p of bodyParagraphs) {
    if (visibleParagraphs.length >= MAX_PARAGRAPHS) break;
    const truncated = p.length > MAX_CHARS_PER_PARAGRAPH
      ? p.slice(0, MAX_CHARS_PER_PARAGRAPH) + "…"
      : p;
    totalChars += truncated.length;
    if (totalChars > MAX_TOTAL_CHARS) break;
    visibleParagraphs.push(truncated);
  }
  const hasMore = visibleParagraphs.length < bodyParagraphs.length || totalChars >= MAX_TOTAL_CHARS;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ImgResponse = ImageResponse as any;

  const W = 800;
  const H = 1280;
  const PX = 72; // horizontal padding — generous whitespace

  return new ImgResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fefdfb",
          fontFamily: '"Noto Serif SC"',
          letterSpacing: "0.02em",
        }}
      >
        {/* Top decorative bar */}
        <div
          style={{
            width: W,
            height: 6,
            background: "linear-gradient(90deg, #b8860b 0%, #d4a745 50%, #b8860b 100%)",
          }}
        />

        {/* ===== HEADER ===== */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: `48px ${PX}px 0 ${PX}px`,
          }}
        >
          {/* Module badge */}
          <div
            style={{
              display: "flex",
              padding: "10px 24px",
              background: "rgba(184, 134, 11, 0.08)",
              borderRadius: 24,
              marginBottom: 36,
              alignSelf: "flex-start",
            }}
          >
            <span
              style={{
                fontSize: 20,
                color: "#b8860b",
                fontWeight: 500,
              }}
            >
              {config.label}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#1c1917",
              lineHeight: 1.3,
              marginBottom: 20,
              maxWidth: W - PX * 2,
            }}
          >
            {data.title}
          </h1>

          {/* Subtitle */}
          {data.subtitle && (
            <p
              style={{
                fontSize: 24,
                color: "#78716c",
                marginBottom: 24,
                maxWidth: W - PX * 2,
              }}
            >
              {data.subtitle}
            </p>
          )}

          {/* Meta tags */}
          {data.meta.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 36 }}>
              {data.meta.map((m, i) => (
                <div
                  key={i}
                  style={{
                    padding: "6px 16px",
                    borderRadius: 16,
                    border: "1px solid #d6d3d1",
                    fontSize: 18,
                    color: "#57534e",
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== DIVIDER ===== */}
        <div style={{ display: "flex", padding: `0 ${PX}px` }}>
          <div
            style={{
              width: "100%",
              height: 1,
              background: "linear-gradient(90deg, transparent 0%, #e7e5e4 20%, #e7e5e4 80%, transparent 100%)",
            }}
          />
        </div>

        {/* ===== BODY ===== */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: `48px ${PX}px`,
            flex: 1,
            gap: 20,
          }}
        >
          {visibleParagraphs.map((p, i) => (
            <p
              key={i}
              style={{
                fontSize: 21,
                color: "#44403c",
                lineHeight: 2.0,
                maxWidth: W - PX * 2,
              }}
            >
              {p}
            </p>
          ))}
          {hasMore && (
            <p
              style={{
                fontSize: 18,
                color: "#a8a29e",
                lineHeight: 2.0,
                marginTop: 8,
              }}
            >
              … 更多内容请访问 cibei.space
            </p>
          )}
        </div>

        {/* ===== FOOTER ===== */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: `32px ${PX}px 40px ${PX}px`,
            borderTop: "1px solid #f0eeec",
          }}
        >
          {/* Brand row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            {/* Lotus icon */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                background: "#b8860b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fefdfb",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              慈
            </div>
            <span
              style={{
                fontSize: 22,
                color: "#1c1917",
                fontWeight: 600,
              }}
            >
              慈悲空间 · Cibei Space
            </span>
          </div>

          {/* URL */}
          <span
            style={{
              fontSize: 16,
              color: "#a8a29e",
              marginBottom: 8,
            }}
          >
            cibei.space{config.urlPrefix}/{slug}
          </span>

          {/* Slogan */}
          <span
            style={{
              fontSize: 16,
              color: "#d6d3d1",
            }}
          >
            深入经藏 · 智慧如海
          </span>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: [
        {
          name: "Noto Serif SC",
          data: fontData,
          style: "normal",
          weight: 400,
        },
        {
          name: "Noto Serif SC",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    }
  );
}
