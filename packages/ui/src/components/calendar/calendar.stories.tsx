import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Calendar, type DateRange } from "./calendar";

// Calendar's props are a union (single/range/multiple), so stories are typed loosely.
// A fixed month and "today" keep the stories stable.
const meta = {
  title: "Components/Calendar",
  component: Calendar,
  decorators: [(Story) => <div className="bg-surface rounded-lg border">{Story()}</div>],
} satisfies Meta;

export default meta;
type Story = StoryObj;

function SingleCalendar(props: Partial<React.ComponentProps<typeof Calendar>>) {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 9, 14));
  return (
    <Calendar
      defaultMonth={new Date(2026, 9, 1)}
      today={new Date(2026, 9, 13)}
      {...(props as object)}
      mode="single"
      selected={date}
      onSelect={setDate}
    />
  );
}

export const Single: Story = { render: () => <SingleCalendar /> };

function RangeCalendar() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 9, 5),
    to: new Date(2026, 9, 16),
  });
  return (
    <Calendar
      mode="range"
      defaultMonth={new Date(2026, 9, 1)}
      today={new Date(2026, 9, 13)}
      numberOfMonths={2}
      selected={range}
      onSelect={setRange}
    />
  );
}

export const Range: Story = { render: () => <RangeCalendar /> };

export const MinAndMax: Story = {
  render: () => <SingleCalendar minDate={new Date(2026, 9, 10)} maxDate={new Date(2026, 9, 28)} />,
};

export const DisabledDates: Story = {
  name: "Disabled dates (Fridays)",
  render: () => <SingleCalendar disabled={{ dayOfWeek: [5] }} />,
};

export const WeekStartsMonday: Story = { render: () => <SingleCalendar weekStartsOn={1} /> };

export const Bangla: Story = {
  name: "Localized (bn-BD)",
  render: () => <SingleCalendar locale="bn-BD" />,
};
