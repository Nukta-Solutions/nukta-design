import { duration, easing, radius, shadow, spacingSteps, zIndex } from "@nukta-solutions/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Foundations/Scales",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Spacing: Story = {
  render: () => (
    <div className="grid gap-2">
      <p className="text-muted-foreground mb-2 text-sm">
        Spacing is a multiple of <code>--spacing: 0.25rem</code>, so <code>p-4</code> is 1rem.
      </p>
      {spacingSteps.map((step) => (
        <div key={step} className="flex items-center gap-4">
          <code className="text-muted-foreground w-16 text-xs">{step}</code>
          <span
            className="bg-accent h-3 rounded-xs"
            style={{ width: `calc(var(--spacing) * ${step})` }}
          />
          <code className="text-muted-foreground text-xs">{step * 0.25}rem</code>
        </div>
      ))}
    </div>
  ),
};

export const Radius: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {Object.entries(radius).map(([name, value]) => (
        <div key={name} className="grid justify-items-center gap-2">
          <span
            className="border-primary bg-secondary size-16 border-2"
            style={{ borderRadius: value }}
          />
          <code className="text-muted-foreground text-xs">rounded-{name}</code>
        </div>
      ))}
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 p-4">
      {Object.entries(shadow).map(([name, value]) => (
        <div key={name} className="grid justify-items-center gap-2">
          <span className="bg-surface size-20 rounded-lg" style={{ boxShadow: value }} />
          <code className="text-muted-foreground text-xs">shadow-{name}</code>
        </div>
      ))}
    </div>
  ),
};

export const LayersAndMotion: Story = {
  render: () => (
    <div className="grid max-w-xl gap-8 text-sm">
      <table className="w-full">
        <caption className="mb-2 text-left font-semibold">Z-index — use z-(--z-name)</caption>
        <tbody>
          {Object.entries(zIndex).map(([name, value]) => (
            <tr key={name} className="border-b">
              <td className="py-1.5 font-mono text-xs">--z-{name}</td>
              <td className="py-1.5 text-right">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="w-full">
        <caption className="mb-2 text-left font-semibold">
          Durations — use duration-(--duration-name)
        </caption>
        <tbody>
          {Object.entries(duration).map(([name, value]) => (
            <tr key={name} className="border-b">
              <td className="py-1.5 font-mono text-xs">--duration-{name}</td>
              <td className="py-1.5 text-right">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="w-full">
        <caption className="mb-2 text-left font-semibold">Easing — use ease-name</caption>
        <tbody>
          {Object.entries(easing).map(([name, value]) => (
            <tr key={name} className="border-b">
              <td className="py-1.5 font-mono text-xs">ease-{name}</td>
              <td className="py-1.5 text-right font-mono text-xs">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};
