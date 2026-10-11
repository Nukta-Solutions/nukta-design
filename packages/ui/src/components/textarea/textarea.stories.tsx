import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../label";
import { Textarea } from "./textarea";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  args: { placeholder: "Tell us about your project…" },
  decorators: [(Story) => <div className="w-96">{Story()}</div>],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { "aria-label": "Message" } };

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="message">Message</Label>
      <Textarea {...args} id="message" />
      <p className="text-muted-foreground text-sm">Grows as you type.</p>
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true, "aria-label": "Message" } };
