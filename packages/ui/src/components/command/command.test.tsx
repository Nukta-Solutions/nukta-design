import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { useKeyboardShortcut } from "../../lib/use-keyboard-shortcut";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";

function Palette({ onSelect }: { onSelect?: (value: string) => void }) {
  return (
    <Command label="Navigation">
      <CommandInput placeholder="Search…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Products">
          <CommandItem onSelect={onSelect}>Domains</CommandItem>
          <CommandItem onSelect={onSelect}>Hosting</CommandItem>
          <CommandItem onSelect={onSelect} disabled>
            Nusend (coming soon)
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

describe("Command", () => {
  it("filters options as you type and shows an empty state", async () => {
    const user = userEvent.setup();
    render(<Palette />);
    const input = screen.getByRole("combobox");
    expect(screen.getAllByRole("option")).toHaveLength(3);
    await user.type(input, "host");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option", { name: "Hosting" })).toBeInTheDocument();
    await user.clear(input);
    await user.type(input, "zzz");
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("navigates with arrow keys and selects with Enter, skipping disabled items", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<Palette onSelect={onSelect} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "Domains" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: "Hosting" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledWith("Hosting");
    expect(screen.getByRole("option", { name: "Nusend (coming soon)" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});

describe("CommandDialog", () => {
  it("opens with ⌘K / Ctrl+K and is a labelled dialog", async () => {
    function App() {
      const [open, setOpen] = useState(false);
      useKeyboardShortcut("k", () => setOpen((o) => !o));
      return (
        <CommandDialog open={open} onOpenChange={setOpen} title="Search Nukta">
          <CommandInput placeholder="Search…" />
          <CommandList>
            <CommandItem>Billing</CommandItem>
          </CommandList>
        </CommandDialog>
      );
    }
    const user = userEvent.setup();
    render(<App />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.keyboard("{Control>}k{/Control}");
    expect(screen.getByRole("dialog", { name: "Search Nukta" })).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("useKeyboardShortcut", () => {
  it("ignores plain keys while typing but allows modifier shortcuts", async () => {
    const plain = vi.fn();
    const mod = vi.fn();
    function Test() {
      useKeyboardShortcut("/", plain, { mod: false });
      useKeyboardShortcut("b", mod);
      return <input aria-label="Name" />;
    }
    const user = userEvent.setup();
    render(<Test />);
    await user.keyboard("/");
    expect(plain).toHaveBeenCalledOnce();
    await user.click(screen.getByRole("textbox"));
    await user.keyboard("/");
    expect(plain).toHaveBeenCalledOnce();
    await user.keyboard("{Meta>}b{/Meta}");
    expect(mod).toHaveBeenCalledOnce();
  });
});
