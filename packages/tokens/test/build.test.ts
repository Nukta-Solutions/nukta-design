import { describe, expect, it } from "vitest";
import { buildThemeCss, buildTokensJson, semanticColorNames } from "../src";

describe("theme.css", () => {
  const css = buildThemeCss();

  it("maps every semantic color into the Tailwind theme", () => {
    for (const name of semanticColorNames) {
      expect(css).toContain(`--color-${name}: var(--nukta-${name});`);
    }
  });

  it("removes the default Tailwind palette", () => {
    expect(css).toContain("--color-*: initial;");
  });

  it("supports .dark and prefers-color-scheme", () => {
    expect(css).toMatch(/\.dark \{/);
    expect(css).toContain("@media (prefers-color-scheme: dark)");
    expect(css).toContain("@custom-variant dark");
  });
});

describe("tokens.json", () => {
  it("contains resolved colors for both modes", () => {
    const json = buildTokensJson();
    expect(json.color.light.primary?.$value).toMatch(/^oklch\(/);
    expect(json.color.dark.primary?.$value).toMatch(/^oklch\(/);
  });
});
