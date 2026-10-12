import type * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

function Faq(props: Partial<React.ComponentProps<typeof Accordion>>) {
  return (
    <Accordion type="single" collapsible {...(props as object)}>
      <AccordionItem value="billing">
        <AccordionTrigger>How am I billed?</AccordionTrigger>
        <AccordionContent>From your wallet.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="refunds">
        <AccordionTrigger>Can I get a refund?</AccordionTrigger>
        <AccordionContent>Within 7 days.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("exposes headings with expandable buttons", async () => {
    const user = userEvent.setup();
    render(<Faq />);
    const trigger = screen.getByRole("button", { name: "How am I billed?" });
    expect(trigger.parentElement?.tagName).toBe("H3");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "How am I billed?" })).toHaveTextContent(
      "From your wallet.",
    );
  });

  it("moves between headers with arrow keys and opens one at a time", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Faq onValueChange={onValueChange} />);
    await user.tab();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: "Can I get a refund?" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith("refunds");
    await user.keyboard("{Home}{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith("billing");
    expect(screen.getByRole("button", { name: "Can I get a refund?" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("supports multiple open items (controlled)", () => {
    render(
      <Accordion type="multiple" value={["billing", "refunds"]}>
        <AccordionItem value="billing">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>a</AccordionContent>
        </AccordionItem>
        <AccordionItem value="refunds">
          <AccordionTrigger>B</AccordionTrigger>
          <AccordionContent>b</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getAllByRole("region")).toHaveLength(2);
  });
});
