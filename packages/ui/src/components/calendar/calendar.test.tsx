import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Calendar, type DateRange } from "./calendar";

// 1 Oct 2026 is a Thursday.
const october = new Date(2026, 9, 1);

function dayButton(name: RegExp) {
  return screen.getByRole("button", { name });
}

describe("Calendar", () => {
  it("renders a labelled month grid starting on Saturday by default", () => {
    render(<Calendar mode="single" defaultMonth={october} />);
    expect(screen.getByRole("grid", { name: "October 2026" })).toBeInTheDocument();
    // Weekday headers are aria-hidden: each day button carries its full date as its name.
    const headers = screen.getAllByRole("columnheader", { hidden: true });
    expect(headers[0]).toHaveAccessibleName("Saturday");
    expect(headers[6]).toHaveAccessibleName("Friday");
  });

  it("supports another week start", () => {
    render(<Calendar mode="single" defaultMonth={october} weekStartsOn={1} />);
    expect(screen.getAllByRole("columnheader", { hidden: true })[0]).toHaveAccessibleName("Monday");
  });

  it("selects a single date (uncontrolled) and labels it", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<Calendar mode="single" defaultMonth={october} onSelect={onSelect} />);
    await user.click(dayButton(/^Wednesday, 14 October 2026/));
    expect(onSelect).toHaveBeenCalledWith(
      new Date(2026, 9, 14),
      expect.anything(),
      expect.anything(),
      expect.anything(),
    );
  });

  it("selects a range (controlled)", async () => {
    function Range() {
      const [range, setRange] = useState<DateRange | undefined>();
      return (
        <>
          <Calendar mode="range" defaultMonth={october} selected={range} onSelect={setRange} />
          <output>
            {range?.from?.getDate()}-{range?.to?.getDate()}
          </output>
        </>
      );
    }
    const user = userEvent.setup();
    render(<Range />);
    await user.click(dayButton(/^Monday, 5 October 2026/));
    await user.click(dayButton(/^Saturday, 10 October 2026/));
    expect(screen.getByText("5-10")).toBeInTheDocument();
    expect(dayButton(/^Wednesday, 7 October 2026, selected/)).toBeInTheDocument();
    const cell = dayButton(/^Wednesday, 7 October 2026/).closest("[role=gridcell]");
    expect(cell).toHaveAttribute("aria-selected", "true");
  });

  it("moves focus with the keyboard and selects with Enter", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <Calendar
        mode="single"
        defaultMonth={october}
        selected={new Date(2026, 9, 14)}
        onSelect={onSelect}
      />,
    );
    dayButton(/^Wednesday, 14 October 2026/).focus();
    await user.keyboard("{ArrowRight}");
    expect(dayButton(/^Thursday, 15 October 2026/)).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(dayButton(/^Thursday, 22 October 2026/)).toHaveFocus();
    await user.keyboard("{PageDown}");
    expect(screen.getByRole("grid", { name: "November 2026" })).toBeInTheDocument();
    expect(dayButton(/^Sunday, 22 November 2026/)).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith(
      new Date(2026, 10, 22),
      expect.anything(),
      expect.anything(),
      expect.anything(),
    );
  });

  it("disables dates outside min/max and blocks navigation past them", async () => {
    const user = userEvent.setup();
    render(
      <Calendar
        mode="single"
        defaultMonth={october}
        minDate={new Date(2026, 9, 10)}
        maxDate={new Date(2026, 9, 20)}
        disabled={new Date(2026, 9, 15)}
      />,
    );
    expect(dayButton(/^Friday, 9 October 2026/)).toBeDisabled();
    expect(dayButton(/^Thursday, 15 October 2026/)).toBeDisabled();
    expect(dayButton(/^Wednesday, 21 October 2026/)).toBeDisabled();
    expect(dayButton(/^Saturday, 10 October 2026/)).toBeEnabled();
    const next = screen.getByRole("button", { name: "Go to next month" });
    expect(next).toHaveAttribute("aria-disabled", "true");
    await user.click(next);
    expect(screen.getByRole("grid", { name: "October 2026" })).toBeInTheDocument();
  });

  it("localizes month, weekday names and digits", () => {
    render(<Calendar mode="single" defaultMonth={october} locale="bn-BD" />);
    const grid = screen.getByRole("grid");
    expect(grid).toHaveAccessibleName(
      new Intl.DateTimeFormat("bn-BD", { month: "long", year: "numeric" }).format(october),
    );
    expect(
      within(grid).getAllByText(new Intl.NumberFormat("bn-BD").format(14)).length,
    ).toBeGreaterThan(0);
  });

  it("marks today", () => {
    render(<Calendar mode="single" defaultMonth={october} today={new Date(2026, 9, 13)} />);
    expect(dayButton(/^Tuesday, 13 October 2026, today/)).toBeInTheDocument();
  });
});

describe("Calendar outside days", () => {
  it("shows outside days for one month and hides them for several", () => {
    const { rerender } = render(<Calendar mode="single" defaultMonth={october} />);
    // 1 Oct 2026 is a Thursday; with a Saturday week start, 26 Sep opens the grid.
    expect(
      screen.getByRole("button", { name: /^Saturday, 26 September 2026/ }),
    ).toBeInTheDocument();
    rerender(<Calendar mode="range" defaultMonth={october} numberOfMonths={2} />);
    expect(
      screen.queryByRole("button", { name: /^Saturday, 26 September 2026/ }),
    ).not.toBeInTheDocument();
  });
});
