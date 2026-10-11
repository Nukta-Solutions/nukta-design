import { wcagContrast } from "culori";
import { describe, expect, it } from "vitest";
import {
  contrastPairs,
  nonTextContrastPairs,
  resolvePaletteRef,
  semanticColors,
  type ColorMode,
} from "../src";

const modes: ColorMode[] = ["light", "dark"];

describe.each(modes)("%s mode contrast", (mode) => {
  const color = (name: keyof (typeof semanticColors)["light"]) =>
    resolvePaletteRef(semanticColors[mode][name]);

  it.each(contrastPairs)("%s on %s meets WCAG AA (4.5:1)", (fg, bg) => {
    expect(wcagContrast(color(fg), color(bg))).toBeGreaterThanOrEqual(4.5);
  });

  it.each(nonTextContrastPairs)("%s on %s meets WCAG 1.4.11 (3:1)", (fg, bg) => {
    expect(wcagContrast(color(fg), color(bg))).toBeGreaterThanOrEqual(3);
  });
});
