import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bold, Italic, LayoutGrid, List, Underline } from "lucide-react";
import { Toggle, ToggleGroup, ToggleGroupItem } from "./toggle-group";

// ToggleGroup's props are a union (single/multiple), so stories set them in JSX.
const meta = {
  title: "Components/Toggle Group",
  component: ToggleGroup,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Segmented: Story = {
  name: "Segmented (single)",
  render: () => (
    <ToggleGroup type="single" defaultValue="yearly" aria-label="Billing cycle">
      <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
      <ToggleGroupItem value="yearly">Yearly · save 20%</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Outline: Story = {
  render: () => (
    <ToggleGroup type="single" variant="outline" defaultValue="grid" aria-label="View">
      <ToggleGroupItem value="list" aria-label="List view">
        <List aria-hidden="true" />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <LayoutGrid aria-hidden="true" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup
      type="multiple"
      variant="outline"
      size="sm"
      defaultValue={["bold"]}
      aria-label="Text formatting"
    >
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold aria-hidden="true" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic aria-hidden="true" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline aria-hidden="true" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="all" aria-label="Status filter" disabled>
      <ToggleGroupItem value="all">All</ToggleGroupItem>
      <ToggleGroupItem value="active">Active</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const SingleToggle: Story = {
  render: () => (
    <Toggle variant="outline" aria-label="Show archived domains">
      Show archived
    </Toggle>
  ),
};
