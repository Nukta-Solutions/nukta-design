"use client";

import {
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Kbd,
  KbdGroup,
  useKeyboardShortcut,
} from "@nukta-solutions/ui";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { allNavItems } from "@/lib/site";

/** ⌘K / Ctrl+K search across pages. Add your own groups (customers, domains…) here. */
export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  useKeyboardShortcut("k", () => setOpen((value) => !value));

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-muted-foreground max-sm:size-9 max-sm:px-0 sm:w-56 sm:justify-between"
      >
        <span className="flex items-center gap-2">
          <Search aria-hidden="true" />
          <span className="max-sm:sr-only">Search…</span>
        </span>
        <KbdGroup className="max-sm:hidden">
          <Kbd title="Command or Control">⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search">
        <CommandInput placeholder="Search pages…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Pages">
            {allNavItems.map(({ href, label, icon: Icon }) => (
              <CommandItem
                key={href}
                onSelect={() => {
                  setOpen(false);
                  router.push(href);
                }}
              >
                <Icon aria-hidden="true" /> {label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
