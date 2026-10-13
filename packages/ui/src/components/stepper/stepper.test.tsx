import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Step, Stepper } from "./stepper";

describe("Stepper", () => {
  it("is an ordered list with the current step marked and statuses announced as text", () => {
    render(
      <Stepper aria-label="Connect domain">
        <Step step={1} status="complete" title="Add domain" />
        <Step step={2} status="current" title="Verify DNS" description="Add the TXT record" />
        <Step step={3} status="upcoming" title="Go live" />
      </Stepper>,
    );
    const list = screen.getByRole("list", { name: "Connect domain" });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[0]).toHaveTextContent("Completed, step 1: Add domain");
    expect(items[2]).toHaveTextContent("Not started, step 3: Go live");
  });

  it("shows errors and localizes status words", () => {
    render(
      <Stepper orientation="vertical" statusLabels={{ error: "ত্রুটি" }}>
        <Step step={1} status="error" title="Verify DNS" />
      </Stepper>,
    );
    const item = screen.getByRole("listitem");
    expect(item).toHaveAttribute("data-status", "error");
    expect(item).toHaveTextContent("ত্রুটি, step 1: Verify DNS");
    expect(screen.getByRole("list")).toHaveAttribute("data-orientation", "vertical");
  });
});
