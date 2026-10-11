import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta = {
  title: "Components/Select",
  component: Select,
  decorators: [(Story) => <div className="w-64">{Story()}</div>],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="country">Country</Label>
      <Select {...args}>
        <SelectTrigger id="country">
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>South Asia</SelectLabel>
            <SelectItem value="bd">Bangladesh</SelectItem>
            <SelectItem value="in">India</SelectItem>
            <SelectItem value="pk">Pakistan</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Middle East</SelectLabel>
            <SelectItem value="ae">United Arab Emirates</SelectItem>
            <SelectItem value="sa">Saudi Arabia</SelectItem>
            <SelectItem value="qa" disabled>
              Qatar (coming soon)
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Small: Story = {
  render: (args) => (
    <Select {...args} defaultValue="weekly">
      <SelectTrigger size="sm" aria-label="Frequency">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="daily">Daily</SelectItem>
        <SelectItem value="weekly">Weekly</SelectItem>
        <SelectItem value="monthly">Monthly</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Select {...args} disabled>
      <SelectTrigger aria-label="Plan">
        <SelectValue placeholder="Unavailable" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">Free</SelectItem>
      </SelectContent>
    </Select>
  ),
};
