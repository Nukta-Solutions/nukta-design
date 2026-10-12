import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./separator";

const meta = {
  title: "Components/Separator",
  component: Separator,
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-80">
      <p className="text-sm font-medium">Nukta Hosting</p>
      <p className="text-muted-foreground text-sm">Managed servers for your apps.</p>
      <Separator {...args} className="my-4" />
      <p className="text-muted-foreground text-sm">3 plans · 12 sites</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>Domains</span>
      <Separator orientation="vertical" />
      <span>Hosting</span>
      <Separator orientation="vertical" />
      <span>Mail</span>
    </div>
  ),
};

export const Semantic: Story = {
  name: "Not decorative",
  render: () => (
    <div className="w-80 text-sm">
      <p>Account settings</p>
      <Separator decorative={false} className="my-4" />
      <p>Danger zone</p>
    </div>
  ),
};
