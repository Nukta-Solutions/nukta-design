import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, FieldDescription, FieldLabel } from "../field";
import { CopyButton, CopyField } from "./copy-button";

const meta = {
  title: "Components/Copy",
  component: CopyButton,
  args: { value: "nukta.app" },
  decorators: [(Story) => <div className="w-96">{Story()}</div>],
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Button: Story = {};

export const ButtonWithText: Story = {
  args: { value: "INV-2026-0142", variant: "outline", size: "sm", children: "Copy invoice number" },
};

export const Field_: Story = {
  name: "Copy field",
  render: () => (
    <div className="grid gap-5">
      <Field>
        <FieldLabel>SMTP host</FieldLabel>
        <CopyField value="smtp.nusend.io" />
        <FieldDescription>Port 587 with STARTTLS.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>SPF record (TXT)</FieldLabel>
        <CopyField value="v=spf1 include:_spf.nusend.io ~all" />
      </Field>
    </div>
  ),
};

export const Secret: Story = {
  render: () => (
    <Field>
      <FieldLabel>Live API key</FieldLabel>
      <CopyField value="nk_live_4f9a1c2b8e7d6a5f3e2d1c0b" secret />
      <FieldDescription>Keep this secret. Rotate it if it leaks.</FieldDescription>
    </Field>
  ),
};
