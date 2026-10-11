import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../label";
import { Switch } from "./switch";

const meta = {
  title: "Components/Switch",
  component: Switch,
  args: { "aria-label": "Airplane mode" },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Switch {...args} id="notifications" aria-label={undefined} defaultChecked />
      <Label htmlFor="notifications">Email notifications</Label>
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };
