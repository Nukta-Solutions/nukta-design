import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";

describe("Collapsible", () => {
  it("toggles with the keyboard and wires aria-expanded/aria-controls", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Collapsible onOpenChange={onOpenChange}>
        <CollapsibleTrigger>DNS records</CollapsibleTrigger>
        <CollapsibleContent>A @ 203.0.113.10</CollapsibleContent>
      </Collapsible>,
    );
    const trigger = screen.getByRole("button", { name: "DNS records" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("A @ 203.0.113.10")).not.toBeInTheDocument();
    await user.tab();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const content = screen.getByText("A @ 203.0.113.10");
    expect(trigger).toHaveAttribute("aria-controls", content.id);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("can start open", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>More</CollapsibleTrigger>
        <CollapsibleContent>Details</CollapsibleContent>
      </Collapsible>,
    );
    expect(screen.getByText("Details")).toBeVisible();
  });
});
