import type { Meta, StoryObj } from "@storybook/react-vite";
import { Settings2 } from "lucide-react";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "./popover";

const meta = {
  title: "Components/Popover",
  component: Popover,
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Settings2 aria-hidden="true" /> Display settings
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Display settings">
        <div className="grid gap-4">
          <div className="grid gap-1">
            <p className="font-medium">Dimensions</p>
            <p className="text-muted-foreground text-sm">Set the size of the widget.</p>
          </div>
          <div className="grid grid-cols-3 items-center gap-3">
            <Label htmlFor="popover-width">Width</Label>
            <Input id="popover-width" size="sm" defaultValue="100%" className="col-span-2" />
            <Label htmlFor="popover-height">Height</Label>
            <Input id="popover-height" size="sm" defaultValue="25px" className="col-span-2" />
          </div>
          <PopoverClose asChild>
            <Button size="sm" className="justify-self-end">
              Done
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Open: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button variant="outline">Account</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Account summary">
        <p className="text-sm">Signed in as hello@nuktasolutions.com</p>
      </PopoverContent>
    </Popover>
  ),
};

export const Placement: Story = {
  render: () => (
    <div className="flex gap-3">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="outline">{side}</Button>
          </PopoverTrigger>
          <PopoverContent side={side} align="start" className="w-48" aria-label={`Popover ${side}`}>
            <p className="text-sm">Opens on the {side}, aligned to the start.</p>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};
