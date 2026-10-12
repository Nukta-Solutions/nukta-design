import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Field, FieldDescription, FieldError, FieldLabel } from "../field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group";

describe("InputGroup", () => {
  it("renders addons around a labelled input inside a Field", () => {
    render(
      <Field invalid>
        <FieldLabel>Amount</FieldLabel>
        <InputGroup>
          <InputGroupAddon>৳</InputGroupAddon>
          <InputGroupInput inputMode="decimal" />
          <InputGroupAddon align="end">BDT</InputGroupAddon>
        </InputGroup>
        <FieldDescription>Minimum ৳100</FieldDescription>
        <FieldError>Too low</FieldError>
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Amount" });
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription("Minimum ৳100 Too low");
    expect(screen.getByText("BDT")).toHaveAttribute("data-align", "end");
  });

  it("focuses the input when a text addon is clicked", async () => {
    const user = userEvent.setup();
    render(
      <InputGroup>
        <InputGroupAddon>৳</InputGroupAddon>
        <InputGroupInput aria-label="Amount" />
      </InputGroup>,
    );
    await user.click(screen.getByText("৳"));
    expect(screen.getByRole("textbox", { name: "Amount" })).toHaveFocus();
  });

  it("supports keyboard-accessible addon buttons", async () => {
    function Clearable() {
      const [value, setValue] = useState("nukta.app");
      return (
        <InputGroup size="sm">
          <InputGroupInput
            aria-label="Domain"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <InputGroupAddon align="end">
            <InputGroupButton aria-label="Clear" onClick={() => setValue("")}>
              ×
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      );
    }
    const user = userEvent.setup();
    render(<Clearable />);
    const input = screen.getByRole("textbox", { name: "Domain" });
    await user.tab();
    expect(input).toHaveFocus();
    await user.tab();
    const clear = screen.getByRole("button", { name: "Clear" });
    expect(clear).toHaveFocus();
    expect(clear).toHaveClass("size-6");
    await user.keyboard("{Enter}");
    expect(input).toHaveValue("");
  });

  it("passes the group size to the input and forwards refs", () => {
    const ref = vi.fn();
    render(
      <InputGroup size="lg">
        <InputGroupInput aria-label="Search" ref={ref} />
      </InputGroup>,
    );
    expect(screen.getByRole("group")).toHaveClass("h-11");
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it("disables through the input", () => {
    render(
      <InputGroup>
        <InputGroupAddon>USD</InputGroupAddon>
        <InputGroupInput aria-label="Price" disabled />
      </InputGroup>,
    );
    expect(screen.getByRole("textbox", { name: "Price" })).toBeDisabled();
  });
});
