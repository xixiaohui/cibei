/**
 * Cebei Space (慈悲空间) design tokens
 *
 * Central source of truth for the design system.
 * Import these values directly in component code where needed.
 * CSS custom properties (defined in globals.css) are the runtime counterpart.
 */

export const colors = {
  background: "#ffffff",
  foreground: "#171717",
  muted: "#f5f5f4",
  "muted-foreground": "#78716c",
  border: "#e7e5e4",
  accent: "#b8860b",       // Dark goldenrod — the ONLY accent color
  "accent-soft": "#fef3c7", // Light gold background
} as const;

export const typography = {
  fontSans: "var(--font-inter)",
  fontSerif: "var(--font-noto-serif-sc)",
  // Reading-optimized sizes
  textBase: "text-lg",
  textLg: "text-xl",
  textXl: "text-2xl",
  heading1: "text-4xl font-bold tracking-tight",
  heading2: "text-3xl font-semibold tracking-tight",
  heading3: "text-2xl font-semibold",
  body: "text-lg leading-relaxed",
  bodySmall: "text-base leading-relaxed",
  caption: "text-sm text-muted-foreground",
} as const;
