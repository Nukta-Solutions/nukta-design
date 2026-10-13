import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import type { DateRange } from "../calendar";
import { Field, FieldError, FieldLabel } from "../field";
import { DatePicker, DateRangePicker, getDefaultDateRangePresets } from "./date-picker";

const oct = (day: number) => new Date(2026, 9, day);

describe("DatePicker", () => {
  it("opens a dialog, focuses the selected day and picks a date (uncontrolled)", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DatePicker aria-label="Due date" defaultValue={oct(14)} onValueChange={onValueChange} />,
    );
    const trigger = screen.getByRole("button", { name: /^Due date/ });
    expect(trigger).toHaveAccessibleName("Due date 14 Oct 2026");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");

    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Wednesday, 14 October 2026/ })).toHaveFocus();

    await user.click(screen.getByRole("button", { name: /^Tuesday, 20 October 2026/ }));
    expect(onValueChange).toHaveBeenCalledWith(oct(20));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent("20 Oct 2026");
  });

  it("works with the keyboard and returns focus on Escape", async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Due date" defaultValue={oct(14)} />);
    const trigger = screen.getByRole("button", { name: /^Due date/ });
    trigger.focus();
    await user.keyboard("{Enter}");
    await user.keyboard("{ArrowRight}{Enter}");
    expect(trigger).toHaveTextContent("15 Oct 2026");
    await user.keyboard("{Enter}");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("is controlled by value", async () => {
    function Controlled() {
      const [date, setDate] = useState<Date | undefined>(oct(1));
      return (
        <>
          <DatePicker aria-label="Start" value={date} onValueChange={setDate} />
          <button onClick={() => setDate(undefined)}>Reset</button>
        </>
      );
    }
    const user = userEvent.setup();
    render(<Controlled />);
    const trigger = screen.getByRole("button", { name: /^Start/ });
    expect(trigger).toHaveTextContent("1 Oct 2026");
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(trigger).toHaveTextContent("Pick a date");
  });

  it("is labelled by a Field with its value and shows invalid state", () => {
    render(
      <Field invalid required>
        <FieldLabel>Invoice date</FieldLabel>
        <DatePicker defaultValue={oct(5)} />
        <FieldError>Choose a date in the past</FieldError>
      </Field>,
    );
    const trigger = screen.getByRole("button", { name: /^Invoice date\s*5 Oct 2026$/ });
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).not.toHaveAttribute("aria-required");
    expect(trigger).toHaveAccessibleDescription("Choose a date in the past");
  });

  it("formats with the locale and options", () => {
    render(
      <DatePicker
        aria-label="Date"
        defaultValue={oct(14)}
        locale="bn-BD"
        formatOptions={{ dateStyle: "long" }}
      />,
    );
    expect(screen.getByRole("button", { name: /^Date/ })).toHaveTextContent(
      new Intl.DateTimeFormat("bn-BD", { dateStyle: "long" }).format(oct(14)),
    );
  });

  it("respects min/max and disabled", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <DatePicker aria-label="Date" minDate={oct(10)} maxDate={oct(20)} defaultValue={oct(12)} />,
    );
    await user.click(screen.getByRole("button", { name: /^Date/ }));
    expect(screen.getByRole("button", { name: /^Friday, 9 October 2026/ })).toBeDisabled();
    await user.keyboard("{Escape}");
    rerender(<DatePicker aria-label="Date" disabled />);
    expect(screen.getByRole("button", { name: /^Date/ })).toBeDisabled();
  });
});

describe("DateRangePicker", () => {
  it("picks a range with two clicks, then closes and shows the range", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DateRangePicker
        aria-label="Period"
        defaultValue={{ from: oct(1), to: oct(3) }}
        onValueChange={onValueChange}
        numberOfMonths={1}
      />,
    );
    const trigger = screen.getByRole("button", { name: /^Period/ });
    expect(trigger).toHaveTextContent(/1\s*[–-]\s*3 Oct 2026/);
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: /^Monday, 5 October 2026/ }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^Saturday, 10 October 2026/ }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    const last = onValueChange.mock.lastCall?.[0] as DateRange;
    expect(last.from).toEqual(oct(5));
    expect(last.to).toEqual(oct(10));
    expect(trigger).toHaveTextContent(/5\s*[–-]\s*10 Oct 2026/);
  });

  it("applies presets relative to now and marks the active one", async () => {
    function WithPresets() {
      const [range, setRange] = useState<DateRange | undefined>();
      return (
        <DateRangePicker
          aria-label="Period"
          presets
          now={oct(13)}
          value={range}
          onValueChange={setRange}
        />
      );
    }
    const user = userEvent.setup();
    render(<WithPresets />);
    const trigger = screen.getByRole("button", { name: /^Period/ });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Last 7 days" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent(/7\s*[–-]\s*13 Oct 2026/);
    await user.click(trigger);
    expect(screen.getByRole("button", { name: "Last 7 days" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Custom" })).toHaveAttribute("aria-pressed", "false");
  });

  it("marks Custom when the range matches no preset", async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        aria-label="Period"
        presets
        now={oct(13)}
        defaultValue={{ from: oct(2), to: oct(4) }}
      />,
    );
    await user.click(screen.getByRole("button", { name: /^Period/ }));
    expect(screen.getByRole("button", { name: "Custom" })).toHaveAttribute("aria-pressed", "true");
  });

  it("computes default presets", () => {
    const presets = getDefaultDateRangePresets(oct(13));
    expect(presets.map((p) => p.key)).toEqual([
      "today",
      "last-7-days",
      "last-30-days",
      "this-month",
      "last-month",
    ]);
    const lastMonth = presets.find((p) => p.key === "last-month")!.range;
    expect(lastMonth.from).toEqual(new Date(2026, 8, 1));
    expect(lastMonth.to).toEqual(new Date(2026, 8, 30));
    expect(presets.find((p) => p.key === "last-30-days")!.range.from).toEqual(
      new Date(2026, 8, 14),
    );
  });

  it("supports custom presets", async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        aria-label="Period"
        presets={[
          {
            key: "q3",
            label: "Q3 2026",
            range: { from: new Date(2026, 6, 1), to: new Date(2026, 8, 30) },
          },
        ]}
        customLabel="Pick dates"
      />,
    );
    await user.click(screen.getByRole("button", { name: /^Period/ }));
    expect(screen.getByRole("group", { name: "Presets" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Q3 2026" }));
    expect(screen.getByRole("button", { name: /^Period/ })).toHaveTextContent(
      /1 Jul\s*[–-]\s*30 Sept? 2026/,
    );
  });
});
