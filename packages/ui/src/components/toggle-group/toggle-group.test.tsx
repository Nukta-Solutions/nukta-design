import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Toggle, ToggleGroup, ToggleGroupItem } from "./toggle-group";

describe("Toggle", () => {
  it("toggles pressed state", async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Show archived">Archived</Toggle>);
    const toggle = screen.getByRole("button", { name: "Show archived" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });
});

describe("ToggleGroup", () => {
  it("is a single-choice radio group with arrow-key navigation (controlled)", async () => {
    function Billing() {
      const [cycle, setCycle] = useState("monthly");
      return (
        <>
          <ToggleGroup
            type="single"
            aria-label="Billing cycle"
            value={cycle}
            onValueChange={(v) => v && setCycle(v)}
          >
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
            <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
          </ToggleGroup>
          <output>{cycle}</output>
        </>
      );
    }
    const user = userEvent.setup();
    render(<Billing />);
    expect(screen.getByRole("radiogroup", { name: "Billing cycle" })).toBeInTheDocument();
    const monthly = screen.getByRole("radio", { name: "Monthly" });
    expect(monthly).toHaveAttribute("aria-checked", "true");
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Yearly" })).toHaveFocus();
    await user.keyboard(" ");
    expect(screen.getByText("yearly")).toBeInTheDocument();
  });

  it("supports multiple selection (uncontrolled)", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ToggleGroup
        type="multiple"
        aria-label="Filters"
        variant="outline"
        onValueChange={onValueChange}
      >
        <ToggleGroupItem value="active">Active</ToggleGroupItem>
        <ToggleGroupItem value="expiring">Expiring</ToggleGroupItem>
      </ToggleGroup>,
    );
    await user.click(screen.getByRole("button", { name: "Active" }));
    await user.click(screen.getByRole("button", { name: "Expiring" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["active", "expiring"]);
    expect(screen.getByRole("button", { name: "Active" })).toHaveAttribute("aria-pressed", "true");
  });
});
