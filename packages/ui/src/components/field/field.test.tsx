import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { Checkbox } from "../checkbox";
import { Input } from "../input";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import { Switch } from "../switch";
import { Textarea } from "../textarea";
import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "./field";

describe("Field", () => {
  it("labels the control and links its description", () => {
    render(
      <Field>
        <FieldLabel>Amount</FieldLabel>
        <Input />
        <FieldDescription>Minimum ৳100</FieldDescription>
        <FieldError>Enter an amount</FieldError>
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Amount" });
    expect(input).toHaveAccessibleDescription("Minimum ৳100");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(screen.queryByText("Enter an amount")).not.toBeInTheDocument();
  });

  it("shows the error and marks the control invalid and required", () => {
    render(
      <Field invalid required>
        <FieldLabel>Amount</FieldLabel>
        <Input />
        <FieldDescription>Minimum ৳100</FieldDescription>
        <FieldError>Enter an amount</FieldError>
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: /Amount/ });
    expect(input).toBeInvalid();
    expect(input).toBeRequired();
    expect(input).toHaveAccessibleDescription("Minimum ৳100 Enter an amount");
    expect(screen.getByText("Enter an amount")).toHaveAttribute("aria-live", "polite");
  });

  it("announces the error when it appears", async () => {
    function Form() {
      const [value, setValue] = useState("");
      const invalid = value.length > 0 && Number.isNaN(Number(value));
      return (
        <Field invalid={invalid}>
          <FieldLabel>Amount</FieldLabel>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
          <FieldError>Numbers only</FieldError>
        </Field>
      );
    }
    const user = userEvent.setup();
    render(<Form />);
    const input = screen.getByRole("textbox", { name: "Amount" });
    await user.type(input, "abc");
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription("Numbers only");
  });

  it("explicit props on the control win over the Field", () => {
    render(
      <Field invalid>
        <FieldLabel>Name</FieldLabel>
        <Input aria-invalid={false} aria-describedby="extra" />
        <span id="extra">Extra help</span>
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).not.toBeInvalid();
    expect(input).toHaveAccessibleDescription("Extra help");
  });

  it("uses the Field id for the control", () => {
    render(
      <Field id="topup-amount">
        <FieldLabel>Amount</FieldLabel>
        <Input />
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "Amount" })).toHaveAttribute("id", "topup-amount");
  });

  it("disables the control", () => {
    render(
      <Field disabled>
        <FieldLabel>Notes</FieldLabel>
        <Textarea />
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "Notes" })).toBeDisabled();
  });

  it("works with Checkbox and Switch in horizontal orientation", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Field orientation="horizontal">
          <Checkbox />
          <FieldLabel>Auto top-up</FieldLabel>
          <FieldDescription>Charge my card when the balance is low</FieldDescription>
        </Field>
        <Field orientation="horizontal" invalid>
          <Switch />
          <FieldLabel>Invoices by email</FieldLabel>
        </Field>
      </>,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Auto top-up" });
    expect(checkbox).toHaveAccessibleDescription("Charge my card when the balance is low");
    await user.click(screen.getByText("Auto top-up"));
    expect(checkbox).toBeChecked();
    expect(screen.getByRole("switch", { name: "Invoices by email" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("works with Select", () => {
    render(
      <Field invalid>
        <FieldLabel>Currency</FieldLabel>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bdt">BDT</SelectItem>
          </SelectContent>
        </Select>
        <FieldError>Choose a currency</FieldError>
      </Field>,
    );
    const trigger = screen.getByRole("combobox", { name: "Currency" });
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAccessibleDescription("Choose a currency");
  });

  it("labels a RadioGroup via aria-labelledby", () => {
    render(
      <Field required>
        <FieldLabel>Payment method</FieldLabel>
        <RadioGroup>
          <RadioGroupItem value="bkash" aria-label="bKash" />
        </RadioGroup>
        <FieldDescription>Choose how to pay</FieldDescription>
      </Field>,
    );
    const group = screen.getByRole("radiogroup", { name: /Payment method/ });
    expect(group).toHaveAttribute("aria-required", "true");
    expect(group).toHaveAccessibleDescription("Choose how to pay");
  });

  it("wires third-party controls with FieldControl", () => {
    render(
      <Field invalid>
        <FieldLabel>Promo code</FieldLabel>
        <FieldControl>
          <input />
        </FieldControl>
        <FieldError>Code expired</FieldError>
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Promo code" });
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription("Code expired");
  });

  it("shows a required indicator hidden from assistive tech", () => {
    render(
      <Field required>
        <FieldLabel>Email</FieldLabel>
        <Input type="email" />
      </Field>,
    );
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("textbox", { name: "Email" })).toBeRequired();
  });
});
