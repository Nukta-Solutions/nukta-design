import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copy, Eye, EyeOff, Globe, Search } from "lucide-react";
import { useState } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "../field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group";

const meta = {
  title: "Components/Input Group",
  component: InputGroup,
  argTypes: { size: { control: "select", options: ["sm", "md", "lg"] } },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CurrencyAmount: Story = {
  render: (args) => (
    <Field>
      <FieldLabel>Top-up amount</FieldLabel>
      <InputGroup {...args}>
        <InputGroupAddon>৳</InputGroupAddon>
        <InputGroupInput inputMode="decimal" placeholder="0.00" />
        <InputGroupAddon align="end">BDT</InputGroupAddon>
      </InputGroup>
      <FieldDescription>Minimum ৳100.</FieldDescription>
    </Field>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <InputGroup key={size} size={size}>
          <InputGroupAddon>USD</InputGroupAddon>
          <InputGroupInput aria-label={`Amount (${size})`} placeholder={size} />
        </InputGroup>
      ))}
    </div>
  ),
};

export const IconPrefix: Story = {
  render: () => (
    <InputGroup>
      <InputGroupAddon>
        <Search aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput type="search" aria-label="Search domains" placeholder="Search domains" />
    </InputGroup>
  ),
};

export const DomainSuffix: Story = {
  render: () => (
    <Field>
      <FieldLabel>Subdomain</FieldLabel>
      <InputGroup>
        <InputGroupAddon>
          <Globe aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput placeholder="shop" />
        <InputGroupAddon align="end">.nukta.app</InputGroupAddon>
      </InputGroup>
    </Field>
  ),
};

function SecretInput() {
  const [visible, setVisible] = useState(false);
  return (
    <Field>
      <FieldLabel>API key</FieldLabel>
      <InputGroup>
        <InputGroupInput
          type={visible ? "text" : "password"}
          defaultValue="nk_live_4f9a1c2b8e7d"
          readOnly
          className="font-mono"
        />
        <InputGroupAddon align="end">
          <InputGroupButton
            aria-label={visible ? "Hide API key" : "Show API key"}
            aria-pressed={visible}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </InputGroupButton>
          <InputGroupButton aria-label="Copy API key">
            <Copy aria-hidden="true" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

export const WithButtons: Story = { render: () => <SecretInput /> };

export const Invalid: Story = {
  render: () => (
    <Field invalid>
      <FieldLabel>Top-up amount</FieldLabel>
      <InputGroup>
        <InputGroupAddon>৳</InputGroupAddon>
        <InputGroupInput inputMode="decimal" defaultValue="40" />
      </InputGroup>
      <FieldError>Amount must be at least ৳100.</FieldError>
    </Field>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field disabled>
      <FieldLabel>Credit limit</FieldLabel>
      <InputGroup>
        <InputGroupAddon>৳</InputGroupAddon>
        <InputGroupInput defaultValue="10,000" />
      </InputGroup>
    </Field>
  ),
};
