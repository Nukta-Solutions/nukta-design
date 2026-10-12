import type { PaletteRef } from "./palette";

/**
 * Semantic color tokens — the ONLY colors components and apps may use.
 * Each token maps to a palette reference per color mode.
 */
export const semanticColorNames = [
  "background",
  "foreground",
  "surface",
  "surface-foreground",
  "muted",
  "muted-foreground",
  "border",
  "input",
  "ring",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "accent",
  "accent-foreground",
  "highlight",
  "highlight-foreground",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "warning-emphasis",
  "danger",
  "danger-foreground",
  "info",
  "info-foreground",
  "overlay",
] as const;

export type SemanticColor = (typeof semanticColorNames)[number];
export type ColorMode = "light" | "dark";
export type SemanticColorMap = Record<SemanticColor, PaletteRef>;

export const semanticColors: Record<ColorMode, SemanticColorMap> = {
  light: {
    background: "neutral.50",
    foreground: "navy.950",
    surface: "white.DEFAULT",
    "surface-foreground": "navy.950",
    muted: "neutral.100",
    "muted-foreground": "neutral.600",
    border: "neutral.200",
    input: "neutral.300",
    ring: "blue.600",
    primary: "navy.900",
    "primary-foreground": "white.DEFAULT",
    secondary: "navy.100",
    "secondary-foreground": "navy.900",
    accent: "blue.700",
    "accent-foreground": "white.DEFAULT",
    highlight: "amber.400",
    "highlight-foreground": "navy.950",
    success: "green.700",
    "success-foreground": "white.DEFAULT",
    warning: "amber.400",
    "warning-foreground": "navy.950",
    "warning-emphasis": "amber.700",
    danger: "red.600",
    "danger-foreground": "white.DEFAULT",
    info: "blue.700",
    "info-foreground": "white.DEFAULT",
    overlay: "navy.950",
  },
  dark: {
    background: "neutral.950",
    foreground: "neutral.50",
    surface: "neutral.900",
    "surface-foreground": "neutral.50",
    muted: "neutral.800",
    "muted-foreground": "neutral.400",
    border: "neutral.800",
    input: "neutral.700",
    ring: "blue.400",
    primary: "blue.300",
    "primary-foreground": "navy.950",
    secondary: "navy.800",
    "secondary-foreground": "neutral.50",
    accent: "blue.400",
    "accent-foreground": "navy.950",
    highlight: "amber.400",
    "highlight-foreground": "navy.950",
    success: "green.400",
    "success-foreground": "neutral.950",
    warning: "amber.400",
    "warning-foreground": "navy.950",
    "warning-emphasis": "amber.400",
    danger: "red.400",
    "danger-foreground": "neutral.950",
    info: "blue.400",
    "info-foreground": "navy.950",
    overlay: "neutral.950",
  },
};

/**
 * Foreground/background pairs that must meet WCAG AA (4.5:1) in every mode.
 * Enforced by test/contrast.test.ts.
 */
export const contrastPairs: ReadonlyArray<readonly [fg: SemanticColor, bg: SemanticColor]> = [
  ["foreground", "background"],
  ["surface-foreground", "surface"],
  ["muted-foreground", "background"],
  ["muted-foreground", "surface"],
  ["muted-foreground", "muted"],
  ["primary-foreground", "primary"],
  ["secondary-foreground", "secondary"],
  ["accent-foreground", "accent"],
  ["highlight-foreground", "highlight"],
  ["success-foreground", "success"],
  ["warning-foreground", "warning"],
  ["danger-foreground", "danger"],
  ["info-foreground", "info"],
  ["primary", "background"],
  ["primary", "surface"],
  ["danger", "surface"],
  ["foreground", "muted"],
  ["accent", "background"],
  ["accent", "surface"],
  // Warning-colored text and icons (amber itself is too light on light surfaces).
  ["warning-emphasis", "background"],
  ["warning-emphasis", "surface"],
  // Status-colored text (e.g. StatCard trends) on plain surfaces.
  ["success", "background"],
  ["success", "surface"],
  ["info", "surface"],
];

/** Non-text UI pairs (focus rings, input borders) that must meet WCAG 1.4.11 (3:1). */
export const nonTextContrastPairs: ReadonlyArray<readonly [fg: SemanticColor, bg: SemanticColor]> =
  [
    ["ring", "background"],
    ["ring", "surface"],
  ];
