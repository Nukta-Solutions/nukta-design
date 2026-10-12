import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "./popover";

function Example(props: { onOpenChange?: (open: boolean) => void }) {
  return (
    <Popover onOpenChange={props.onOpenChange}>
      <PopoverTrigger asChild>
        <Button>Filters</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Filter options">
        <label>
          Status <input />
        </label>
        <PopoverClose asChild>
          <Button>Done</Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}

describe("Popover", () => {
  it("opens from the trigger with expanded state and moves focus inside", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Filters" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const dialog = screen.getByRole("dialog", { name: "Filter options" });
    expect(dialog).toHaveClass("z-(--z-popover)");
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it("closes with Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Filters" });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes via PopoverClose (uncontrolled)", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<Example onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button", { name: "Filters" }));
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("supports controlled open state", async () => {
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <>
          <span>{open ? "open" : "closed"}</span>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>Toggle</PopoverTrigger>
            <PopoverContent>Content</PopoverContent>
          </Popover>
        </>
      );
    }
    const user = userEvent.setup();
    render(<Controlled />);
    expect(screen.getByText("Content")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.getByText("closed")).toBeInTheDocument();
  });
});
