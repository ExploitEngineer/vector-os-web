/**
 * JS-side mirror of the CSS color tokens in `globals.css` (`@theme`).
 * Use these only where a color must be computed or inlined at runtime
 * (per-item borders, terminal bootlog lines, dynamic badges). For static
 * styling prefer the Tailwind utilities (`text-vos-cyan`, `bg-vos-surface`…).
 */
export const COLORS = {
  cyan: "#00e5ff",
  green: "#22ff6e",
  red: "#ff2d55",
  amber: "#ffbd2e",
  muted: "#555555",
  white: "#ffffff",
} as const;

/** Blog category → accent color. */
export const CAT_COLORS: Record<string, string> = {
  LINUX: COLORS.green,
  SECURITY: COLORS.red,
  TOOLS: COLORS.cyan,
};

/** Project status → label + accent color. */
export const STATUS_CFG: Record<string, { label: string; color: string }> = {
  active: { label: "ACTIVE", color: COLORS.green },
  "coming-soon": { label: "IN DEV", color: COLORS.cyan },
  classified: { label: "CLASSIFIED", color: COLORS.red },
};

/** Programming language → GitHub-style dot color. */
export const LANG_COLORS: Record<string, string> = {
  C: "#555555",
  "C#": "#178600",
  Python: "#3572a5",
};
