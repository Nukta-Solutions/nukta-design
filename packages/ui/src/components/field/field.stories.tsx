import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { Input } from "../input";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import { Switch } from "../switch";
import { Textarea } from "../textarea";
import { Field, FieldDescription, FieldError, FieldLabel } from "./field";

const meta = {
  title: "Components/Field",
  component: Field,
  decorators: [(Story) => <div className="w-96">{Story()}</div>],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Field {...args}>
      <FieldLabel>Email</FieldLabel>
      <Input type="email" placeholder="you@company.com" />
      <FieldDescription>We send invoices here.</FieldDescription>
      <FieldError>Enter a valid email address.</FieldError>
    </Field>
  ),
};

export const Required: Story = { ...Default, args: { required: true } };

export const Invalid: Story = {
  render: () => (
    <Field invalid required>
      <FieldLabel>Amount</FieldLabel>
      <Input inputMode="decimal" defaultValue="50" />
      <FieldDescription>Minimum top-up is ৳100.</FieldDescription>
      <FieldError>Amount must be at least ৳100.</FieldError>
    </Field>
  ),
};

export const Disabled: Story = { ...Default, args: { disabled: true } };

export const Textareas: Story = {
  render: () => (
    <Field>
      <FieldLabel>Notes for the invoice</FieldLabel>
      <Textarea placeholder="Optional" />
      <FieldDescription>Shown on the PDF.</FieldDescription>
    </Field>
  ),
};

export const SelectControl: Story = {
  render: () => (
    <Field invalid>
      <FieldLabel>Billing country</FieldLabel>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose a country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="bd">Bangladesh</SelectItem>
          <SelectItem value="ae">United Arab Emirates</SelectItem>
        </SelectContent>
      </Select>
      <FieldError>Choose a country.</FieldError>
    </Field>
  ),
};

export const CheckboxAndSwitch: Story = {
  render: () => (
    <div className="grid gap-5">
      <Field orientation="horizontal">
        <Checkbox />
        <FieldLabel>Auto top-up</FieldLabel>
        <FieldDescription>Charge my saved card when the balance drops below ৳200.</FieldDescription>
      </Field>
      <Field orientation="horizontal">
        <Switch defaultChecked />
        <FieldLabel>Email me invoices</FieldLabel>
      </Field>
    </div>
  ),
};

export const RadioGroupControl: Story = {
  render: () => (
    <Field required>
      <FieldLabel>Payment method</FieldLabel>
      <RadioGroup defaultValue="bkash">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="bkash" id="pm-bkash" />
          <label htmlFor="pm-bkash" className="text-sm">
            bKash
          </label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="card" id="pm-card" />
          <label htmlFor="pm-card" className="text-sm">
            Card
          </label>
        </div>
      </RadioGroup>
      <FieldDescription>You can change it later.</FieldDescription>
    </Field>
  ),
};

function ValidatingForm() {
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const invalid = submitted && !(Number(amount) >= 100);
  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      noValidate
    >
      <Field invalid={invalid} required>
        <FieldLabel>Top-up amount</FieldLabel>
        <Input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <FieldDescription>Minimum ৳100.</FieldDescription>
        <FieldError>Enter at least ৳100.</FieldError>
      </Field>
      <Button type="submit" className="justify-self-start">
        Continue
      </Button>
    </form>
  );
}

export const Validation: Story = { render: () => <ValidatingForm /> };
