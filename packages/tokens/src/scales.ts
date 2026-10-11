/**
 * Non-color design scales. Keys become Tailwind v4 theme variables, e.g.
 * `radius.lg` -> `--radius-lg` -> `rounded-lg`.
 */

/** Tailwind v4 spacing multiplier: `p-4` = 4 × 0.25rem = 1rem. */
export const spacing = "0.25rem";

/** Named spacing steps, documented for Figma sync. Values are multiples of `spacing`. */
export const spacingSteps = [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32] as const;

export const radius = {
  xs: "0.125rem",
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  full: "9999px",
} as const;

export const fontFamily = {
  sans: '"Inter Variable", Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  display: '"Clash Display", "Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
} as const;

/** Font size with its paired line height. */
export const fontSize = {
  xs: { size: "0.75rem", lineHeight: "1rem" },
  sm: { size: "0.875rem", lineHeight: "1.25rem" },
  base: { size: "1rem", lineHeight: "1.5rem" },
  lg: { size: "1.125rem", lineHeight: "1.75rem" },
  xl: { size: "1.25rem", lineHeight: "1.75rem" },
  "2xl": { size: "1.5rem", lineHeight: "2rem" },
  "3xl": { size: "1.875rem", lineHeight: "2.25rem" },
  "4xl": { size: "2.25rem", lineHeight: "2.5rem" },
  "5xl": { size: "3rem", lineHeight: "1.1" },
} as const;

export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const lineHeight = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
} as const;

/** Shadows are tinted with the brand navy rather than pure black. */
export const shadow = {
  xs: "0 1px 2px 0 oklch(27.4% 0.082 266.6 / 0.06)",
  sm: "0 1px 3px 0 oklch(27.4% 0.082 266.6 / 0.1), 0 1px 2px -1px oklch(27.4% 0.082 266.6 / 0.1)",
  md: "0 4px 6px -1px oklch(27.4% 0.082 266.6 / 0.1), 0 2px 4px -2px oklch(27.4% 0.082 266.6 / 0.1)",
  lg: "0 10px 15px -3px oklch(27.4% 0.082 266.6 / 0.1), 0 4px 6px -4px oklch(27.4% 0.082 266.6 / 0.1)",
  xl: "0 20px 25px -5px oklch(27.4% 0.082 266.6 / 0.1), 0 8px 10px -6px oklch(27.4% 0.082 266.6 / 0.1)",
} as const;

/**
 * Layering scale. Tailwind v4 has no z-index theme namespace, so these are plain CSS variables:
 * use them as `z-(--z-dropdown)`.
 */
export const zIndex = {
  base: "0",
  raised: "10",
  sticky: "100",
  overlay: "1000",
  dropdown: "1100",
  modal: "1200",
  popover: "1300",
  toast: "1400",
  tooltip: "1500",
} as const;

/** Durations are plain CSS variables: use them as `duration-(--duration-fast)`. */
export const duration = {
  instant: "0ms",
  fast: "120ms",
  normal: "200ms",
  slow: "320ms",
} as const;

/** Easing curves map to Tailwind's `--ease-*` namespace: `ease-standard`, `ease-emphasized`... */
export const easing = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  emphasized: "cubic-bezier(0.3, 0, 0, 1.3)",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
} as const;
