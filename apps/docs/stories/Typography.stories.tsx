import { fontFamily, fontSize, fontWeight } from "@nukta-solutions/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Foundations/Typography",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Families: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-8">
      {Object.entries(fontFamily).map(([name, stack]) => (
        <div key={name} className="grid gap-1">
          <code className="text-muted-foreground text-xs">font-{name}</code>
          <p className="text-3xl" style={{ fontFamily: stack }}>
            Building digital products in Dhaka
          </p>
          <code className="text-muted-foreground text-xs">{stack}</code>
        </div>
      ))}
      <p className="text-muted-foreground text-sm">
        Headings (<code>h1</code>–<code>h3</code>) use <strong>Clash Display</strong>. All other
        text uses <strong>Inter</strong>.
      </p>
    </div>
  ),
};

export const Scale: Story = {
  render: () => (
    <div className="grid gap-4">
      {Object.entries(fontSize).map(([name, { size, lineHeight }]) => (
        <div key={name} className="grid grid-cols-6 items-baseline gap-4">
          <code className="text-muted-foreground col-span-1 text-xs">
            text-{name}
            <br />
            {size} / {lineHeight}
          </code>
          <p className="col-span-5" style={{ fontSize: size, lineHeight }}>
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
      ))}
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div className="grid gap-3">
      {Object.entries(fontWeight).map(([name, weight]) => (
        <p key={name} className="text-xl" style={{ fontWeight: Number(weight) }}>
          font-{name} ({weight}) — Nukta Solutions
        </p>
      ))}
    </div>
  ),
};
