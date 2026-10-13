import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "../field";
import { Combobox, type ComboboxOption } from "./combobox";

const countries: ComboboxOption[] = [
  { value: "bd", label: "Bangladesh", keywords: ["BD", "Dhaka"] },
  { value: "in", label: "India", keywords: ["IN"] },
  { value: "pk", label: "Pakistan", keywords: ["PK"] },
  { value: "ae", label: "United Arab Emirates", keywords: ["UAE", "Dubai"] },
  { value: "sa", label: "Saudi Arabia", keywords: ["KSA"] },
  { value: "my", label: "Malaysia", keywords: ["MY"] },
  { value: "gb", label: "United Kingdom", keywords: ["UK"] },
  { value: "us", label: "United States", keywords: ["USA"] },
];

const mailboxes: ComboboxOption[] = [
  { value: "hello", label: "hello@nukta.app", description: "Shared inbox" },
  { value: "billing", label: "billing@nukta.app", description: "Finance team" },
  { value: "support", label: "support@nukta.app", description: "Support team" },
  { value: "harun", label: "harun@nukta.app" },
  { value: "asif", label: "asif@nukta.app" },
  { value: "noreply", label: "noreply@nukta.app", disabled: true, description: "Send-only" },
];

const meta = {
  title: "Components/Combobox",
  component: Combobox,
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Single: Story = {
  render: () => (
    <Field>
      <FieldLabel>Billing country</FieldLabel>
      <Combobox
        options={countries}
        placeholder="Choose a country"
        searchPlaceholder="Search countries…"
      />
      <FieldDescription>Type a name or code, e.g. UAE.</FieldDescription>
    </Field>
  ),
};

function MultipleExample() {
  const [value, setValue] = useState<string[]>(["hello", "billing", "support"]);
  return (
    <Field>
      <FieldLabel>Forward to</FieldLabel>
      <Combobox
        multiple
        options={mailboxes}
        value={value}
        onValueChange={setValue}
        placeholder="Choose mailboxes"
      />
      <FieldDescription>{value.length} selected</FieldDescription>
    </Field>
  );
}

export const Multiple: Story = { render: () => <MultipleExample /> };

export const Invalid: Story = {
  render: () => (
    <Field invalid required>
      <FieldLabel>Billing country</FieldLabel>
      <Combobox options={countries} placeholder="Choose a country" />
      <FieldError>Choose a country.</FieldError>
    </Field>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field disabled>
      <FieldLabel>Billing country</FieldLabel>
      <Combobox options={countries} defaultValue="bd" />
    </Field>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Combobox
          key={size}
          size={size}
          aria-label={`Country (${size})`}
          options={countries}
          defaultValue="bd"
        />
      ))}
    </div>
  ),
};
