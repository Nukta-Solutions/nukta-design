import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../checkbox";
import { Label } from "./label";

const meta = {
  title: "Components/Label",
  component: Label,
  args: { children: "Email address" },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithControl: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="newsletter" />
      <Label {...args} htmlFor="newsletter">
        Subscribe to the newsletter
      </Label>
    </div>
  ),
};
