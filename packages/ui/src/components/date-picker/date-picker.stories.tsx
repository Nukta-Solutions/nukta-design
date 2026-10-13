import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { DateRange } from "../calendar";
import { Field, FieldDescription, FieldError, FieldLabel } from "../field";
import { DatePicker, DateRangePicker } from "./date-picker";

// A fixed "now" keeps preset stories stable.
const now = new Date(2026, 9, 13);

const meta = {
  title: "Components/Date Picker",
  component: DatePicker,
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Field>
      <FieldLabel>Invoice date</FieldLabel>
      <DatePicker {...args} />
    </Field>
  ),
};

export const WithValue: Story = { ...Default, args: { defaultValue: new Date(2026, 9, 14) } };

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <DatePicker key={size} size={size} aria-label={`Date (${size})`} defaultValue={now} />
      ))}
    </div>
  ),
};

export const MinMaxAndDisabledDays: Story = {
  name: "Min/max + no Fridays",
  render: () => (
    <Field>
      <FieldLabel>Delivery date</FieldLabel>
      <DatePicker
        defaultValue={new Date(2026, 9, 15)}
        minDate={now}
        maxDate={new Date(2026, 10, 30)}
        disabledDates={{ dayOfWeek: [5] }}
      />
      <FieldDescription>Within the next 7 weeks, not on Fridays.</FieldDescription>
    </Field>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field invalid required>
      <FieldLabel>Renewal date</FieldLabel>
      <DatePicker />
      <FieldError>Choose a renewal date.</FieldError>
    </Field>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field disabled>
      <FieldLabel>Created on</FieldLabel>
      <DatePicker defaultValue={new Date(2026, 0, 3)} />
    </Field>
  ),
};

export const Localized: Story = {
  name: "Localized (bn-BD)",
  render: () => (
    <DatePicker
      aria-label="তারিখ"
      locale="bn-BD"
      placeholder="তারিখ বাছাই করুন"
      formatOptions={{ dateStyle: "long" }}
      defaultValue={now}
    />
  ),
};

function ControlledRange() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 9, 1),
    to: new Date(2026, 9, 13),
  });
  return (
    <div className="grid gap-2">
      <DateRangePicker
        aria-label="Transactions period"
        presets
        now={now}
        value={range}
        onValueChange={setRange}
      />
      <p className="text-muted-foreground text-sm">
        From {range?.from?.toDateString() ?? "—"} to {range?.to?.toDateString() ?? "—"}
      </p>
    </div>
  );
}

export const RangeWithPresets: Story = {
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
  render: () => <ControlledRange />,
};

export const RangeWithoutPresets: Story = {
  render: () => (
    <Field>
      <FieldLabel>Report period</FieldLabel>
      <DateRangePicker numberOfMonths={1} />
    </Field>
  ),
};
