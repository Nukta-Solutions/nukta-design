import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd, KbdGroup } from "./kbd";

const meta = {
  title: "Components/Kbd",
  component: Kbd,
  args: { children: "K" },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Shortcuts: Story = {
  render: () => (
    <div className="grid gap-3 text-sm">
      <p className="flex items-center gap-2">
        Search everything
        <KbdGroup>
          <Kbd title="Command">⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </p>
      <p className="flex items-center gap-2">
        Toggle sidebar
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <span aria-hidden="true">+</span>
          <Kbd>B</Kbd>
        </KbdGroup>
      </p>
      <p className="flex items-center gap-2">
        Close <Kbd>Esc</Kbd>
      </p>
    </div>
  ),
};
