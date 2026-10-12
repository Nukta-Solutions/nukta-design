import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CreditCard,
  Globe,
  LayoutDashboard,
  Mail,
  Plus,
  Send,
  Server,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { useKeyboardShortcut } from "../../lib/use-keyboard-shortcut";
import { Button } from "../button";
import { Kbd, KbdGroup } from "../kbd";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command";

const meta = {
  title: "Components/Command",
  component: Command,
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

function Items() {
  return (
    <>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Products">
        <CommandItem>
          <LayoutDashboard aria-hidden="true" /> Nukta Admin
        </CommandItem>
        <CommandItem>
          <Globe aria-hidden="true" /> Nukta Domain
        </CommandItem>
        <CommandItem>
          <Server aria-hidden="true" /> Nukta Hosting
        </CommandItem>
        <CommandItem>
          <Mail aria-hidden="true" /> Nukta Mail
        </CommandItem>
        <CommandItem>
          <Send aria-hidden="true" /> Nusend
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Actions">
        <CommandItem>
          <Plus aria-hidden="true" /> Register a domain
          <CommandShortcut>⌘D</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <CreditCard aria-hidden="true" /> Top up wallet
        </CommandItem>
        <CommandItem>
          <Settings aria-hidden="true" /> Settings
          <CommandShortcut>⌘,</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </>
  );
}

export const Inline: Story = {
  render: () => (
    <Command label="Search Nukta" className="w-md rounded-lg border shadow-md">
      <CommandInput placeholder="Search products and actions…" />
      <CommandList>
        <Items />
      </CommandList>
    </Command>
  ),
};

function PaletteExample() {
  const [open, setOpen] = useState(false);
  useKeyboardShortcut("k", () => setOpen((o) => !o));
  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="text-muted-foreground w-64 justify-between"
      >
        Search…
        <KbdGroup>
          <Kbd title="Command or Control">⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search Nukta">
        <CommandInput placeholder="Search products and actions…" />
        <CommandList>
          <Items />
        </CommandList>
      </CommandDialog>
    </>
  );
}

export const Palette: Story = { name: "Dialog (⌘K)", render: () => <PaletteExample /> };
