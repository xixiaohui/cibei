/**
 * Strip YAML frontmatter (--- ... ---) from MDX source.
 * Returns the content body only.
 */
export function stripFrontmatter(source: string): string {
  const match = source.match(/^---\n[\s\S]*?\n---\n/);
  if (match) return source.slice(match[0].length);
  return source;
}

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Extract h2/h3 headings from MDX source for server-side TOC generation.
 * Generates stable IDs based on heading text.
 */
export function extractHeadings(source: string): TocHeading[] {
  const body = stripFrontmatter(source);
  const headings: TocHeading[] = [];
  const regex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(body)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    headings.push({ id: headingId(text), text, level });
  }
  return headings;
}

function headingId(text: string): string {
  return `s-${text
    .replace(/[^一-鿿\w]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()}`;
}
