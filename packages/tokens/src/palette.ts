/**
 * Raw color palette, generated in OKLCH from the Nukta Solutions logo:
 *   navy-900  = #15244F (wordmark)
 *   blue-600  = #0282C9 (accent mark)
 *   amber-400 = #FFBA00 (the nukta dot)
 *
 * Palette values are PRIVATE. Components and apps must use the semantic tokens in `semantic.ts`;
 * the palette is only exposed as `--nukta-palette-*` variables for those mappings and for Figma sync.
 */
export const palette = {
  neutral: {
    50: "oklch(98.5% 0.006 262)",
    100: "oklch(96.5% 0.009 262)",
    200: "oklch(92% 0.011 262)",
    300: "oklch(87% 0.014 262)",
    400: "oklch(71% 0.016 262)",
    500: "oklch(55% 0.019 262)",
    600: "oklch(45% 0.019 262)",
    700: "oklch(37% 0.016 262)",
    800: "oklch(28% 0.014 262)",
    900: "oklch(21% 0.011 262)",
    950: "oklch(16% 0.009 262)",
  },
  navy: {
    50: "oklch(98% 0.009 266.6)",
    100: "oklch(95.5% 0.021 266.6)",
    200: "oklch(90.5% 0.046 266.6)",
    300: "oklch(83.5% 0.076 266.6)",
    400: "oklch(75% 0.089 266.6)",
    500: "oklch(65% 0.103 266.6)",
    600: "oklch(55% 0.103 266.6)",
    700: "oklch(46% 0.089 266.6)",
    800: "oklch(37% 0.076 266.6)",
    900: "oklch(27.4% 0.082 266.6)",
    950: "oklch(20% 0.07 266.6)",
  },
  blue: {
    50: "oklch(98% 0.01 243.8)",
    100: "oklch(95.5% 0.023 243.8)",
    200: "oklch(90.5% 0.05 243.8)",
    300: "oklch(83.5% 0.089 243.8)",
    400: "oklch(75% 0.13 243.8)",
    500: "oklch(66% 0.15 243.8)",
    600: "oklch(58.4% 0.143 243.8)",
    700: "oklch(48% 0.118 243.8)",
    800: "oklch(40% 0.098 243.8)",
    900: "oklch(31% 0.076 243.8)",
    950: "oklch(23% 0.056 243.8)",
  },
  amber: {
    50: "oklch(98.5% 0.014 81.5)",
    100: "oklch(96% 0.038 81.5)",
    200: "oklch(92% 0.077 81.5)",
    300: "oklch(87.5% 0.117 81.5)",
    400: "oklch(83.1% 0.171 81.5)",
    500: "oklch(74% 0.153 81.5)",
    600: "oklch(64% 0.132 81.5)",
    700: "oklch(54% 0.111 81.5)",
    800: "oklch(45% 0.093 81.5)",
    900: "oklch(37% 0.076 81.5)",
    950: "oklch(27% 0.056 81.5)",
  },
  green: {
    50: "oklch(98% 0.031 152)",
    100: "oklch(95.5% 0.07 152)",
    200: "oklch(90.5% 0.09 152)",
    300: "oklch(83.5% 0.11 152)",
    400: "oklch(75% 0.13 152)",
    500: "oklch(66% 0.15 152)",
    600: "oklch(57% 0.15 152)",
    700: "oklch(48% 0.126 152)",
    800: "oklch(40% 0.105 152)",
    900: "oklch(31% 0.082 152)",
    950: "oklch(23% 0.06 152)",
  },
  red: {
    50: "oklch(98% 0.01 25)",
    100: "oklch(95.5% 0.022 25)",
    200: "oklch(90.5% 0.049 25)",
    300: "oklch(83.5% 0.091 25)",
    400: "oklch(75% 0.151 25)",
    500: "oklch(66% 0.188 25)",
    600: "oklch(57% 0.188 25)",
    700: "oklch(48% 0.163 25)",
    800: "oklch(40% 0.138 25)",
    900: "oklch(31% 0.113 25)",
    950: "oklch(23% 0.088 25)",
  },

  white: { DEFAULT: "oklch(100% 0 0)" },
} as const;

export type PaletteHue = keyof typeof palette;
export type PaletteRef = {
  [H in PaletteHue]: `${H}.${Extract<keyof (typeof palette)[H], string | number>}`;
}[PaletteHue];

export function resolvePaletteRef(ref: PaletteRef): string {
  const [hue, step] = ref.split(".") as [PaletteHue, string];
  const value = (palette[hue] as Record<string, string>)[step];
  if (!value) throw new Error(`Unknown palette reference: ${ref}`);
  return value;
}
