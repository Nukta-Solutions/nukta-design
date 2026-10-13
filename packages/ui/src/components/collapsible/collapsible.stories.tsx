import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "../button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";

const meta = {
  title: "Components/Collapsible",
  component: Collapsible,
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Collapsible {...args} className="grid gap-2">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold">nukta.app · 4 DNS records</p>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Toggle DNS records">
            <ChevronsUpDown aria-hidden="true" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-3 py-2 font-mono text-sm">A @ 203.0.113.10</div>
      <CollapsibleContent className="grid gap-2">
        <div className="rounded-md border px-3 py-2 font-mono text-sm">CNAME www nukta.app</div>
        <div className="rounded-md border px-3 py-2 font-mono text-sm">MX @ mail.nukta.app</div>
        <div className="rounded-md border px-3 py-2 font-mono text-sm">
          TXT @ v=spf1 include:nusend
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const Open: Story = { ...Default, args: { defaultOpen: true } };
