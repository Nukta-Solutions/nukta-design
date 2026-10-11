import {
  palette,
  resolvePaletteRef,
  semanticColorNames,
  semanticColors,
  type ColorMode,
} from "@nukta-solutions/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Foundations/Colors",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Swatch({ value, label }: { value: string; label?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="size-8 shrink-0 rounded-md border"
        style={{ backgroundColor: value }}
        aria-hidden="true"
      />
      {label && <code className="text-muted-foreground text-xs">{label}</code>}
    </div>
  );
}

export const Semantic: Story = {
  render: () => (
    <div className="grid gap-6">
      <p className="text-muted-foreground max-w-2xl text-sm">
        Use these names in components and apps, e.g. <code>bg-primary</code> or{" "}
        <code>text-danger-foreground</code>. Each one resolves to a palette color per mode.
      </p>
      <table className="w-full max-w-3xl text-sm">
        <thead>
          <tr className="text-muted-foreground border-b text-left">
            <th className="py-2 font-medium">Token</th>
            <th className="py-2 font-medium">Light</th>
            <th className="py-2 font-medium">Dark</th>
          </tr>
        </thead>
        <tbody>
          {semanticColorNames.map((name) => (
            <tr key={name} className="border-b">
              <td className="py-2 font-mono text-xs">{name}</td>
              {(["light", "dark"] as ColorMode[]).map((mode) => (
                <td key={mode} className="py-2">
                  <Swatch
                    value={resolvePaletteRef(semanticColors[mode][name])}
                    label={semanticColors[mode][name]}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const Palette: Story = {
  render: () => (
    <div className="grid gap-6">
      <p className="text-muted-foreground max-w-2xl text-sm">
        The raw palette is private. It is generated from the logo: navy-900 = #15244F, blue-600 =
        #0282C9, amber-400 = #FFBA00. Map new semantic tokens to it in{" "}
        <code>packages/tokens/src/semantic.ts</code>. Never use it directly.
      </p>
      {Object.entries(palette).map(([hue, steps]) => (
        <div key={hue} className="grid gap-2">
          <h3 className="text-sm font-semibold capitalize">{hue}</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(steps).map(([step, value]) => (
              <div key={step} className="grid justify-items-center gap-1">
                <span
                  className="size-12 rounded-md border"
                  style={{ backgroundColor: value }}
                  aria-hidden="true"
                />
                <code className="text-muted-foreground text-xs">{step}</code>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
