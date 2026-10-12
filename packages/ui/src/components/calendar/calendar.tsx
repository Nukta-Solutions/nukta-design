import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import {
  DayPicker,
  type DayButtonProps,
  type DayPickerProps,
  type Matcher,
} from "react-day-picker";
import { cn } from "../../lib/cn";
import { DEFAULT_LOCALE, DEFAULT_WEEK_STARTS_ON, dateFormat } from "../../lib/intl";
import { buttonVariants } from "../button";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type CalendarProps = DistributiveOmit<DayPickerProps, "locale"> & {
  /** BCP 47 locale for month/weekday names and digits, e.g. "en-GB" (default) or "bn-BD". */
  locale?: string;
  /** Earliest selectable date; also stops navigation before its month. */
  minDate?: Date;
  /** Latest selectable date; also stops navigation after its month. */
  maxDate?: Date;
};

/**
 * Month grid for picking a date or a range. Built on react-day-picker and styled with Nukta tokens.
 * Keyboard: arrows move by day/week, Page Up/Down by month (+Shift: year), Home/End to week edges.
 */
export function Calendar({
  className,
  classNames,
  locale = DEFAULT_LOCALE,
  minDate,
  maxDate,
  disabled,
  weekStartsOn = DEFAULT_WEEK_STARTS_ON,
  showOutsideDays = true,
  startMonth,
  endMonth,
  formatters,
  labels,
  components,
  ...props
}: CalendarProps) {
  const disabledMatchers = useMemo(() => {
    const list: Matcher[] = disabled ? (Array.isArray(disabled) ? [...disabled] : [disabled]) : [];
    if (minDate) list.push({ before: minDate });
    if (maxDate) list.push({ after: maxDate });
    return list.length ? list : undefined;
  }, [disabled, minDate, maxDate]);

  const intl = useMemo(() => {
    const caption = dateFormat(locale, { month: "long", year: "numeric" });
    const weekdayShort = dateFormat(locale, { weekday: "short" });
    const weekdayLong = dateFormat(locale, { weekday: "long" });
    const fullDate = dateFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const number = new Intl.NumberFormat(locale, { useGrouping: false });
    return { caption, weekdayShort, weekdayLong, fullDate, number };
  }, [locale]);

  return (
    <DayPicker
      data-slot="calendar"
      lang={locale}
      weekStartsOn={weekStartsOn}
      showOutsideDays={showOutsideDays}
      startMonth={startMonth ?? minDate}
      endMonth={endMonth ?? maxDate}
      disabled={disabledMatchers}
      className={cn("w-fit p-3", className)}
      classNames={{
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "flex flex-col gap-3",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        button_previous: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative z-(--z-raised) size-8 aria-disabled:pointer-events-none aria-disabled:opacity-50",
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative z-(--z-raised) size-8 aria-disabled:pointer-events-none aria-disabled:opacity-50",
        ),
        month_caption: "flex h-8 items-center justify-center px-8",
        caption_label: "text-sm font-semibold",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-xs font-normal text-muted-foreground",
        week: "mt-1 flex w-full",
        day: "relative size-9 p-0 text-center text-sm",
        range_start: "rounded-l-md bg-secondary",
        range_middle: "bg-secondary",
        range_end: "rounded-r-md bg-secondary",
        hidden: "invisible",
        ...classNames,
      }}
      formatters={{
        formatCaption: (month) => intl.caption.format(month),
        formatWeekdayName: (weekday) => intl.weekdayShort.format(weekday),
        formatDay: (date) => intl.number.format(date.getDate()),
        ...formatters,
      }}
      labels={{
        labelGrid: (month) => intl.caption.format(month),
        labelWeekday: (weekday) => intl.weekdayLong.format(weekday),
        labelDayButton: (date, modifiers) =>
          [intl.fullDate.format(date), modifiers.today && "today", modifiers.selected && "selected"]
            .filter(Boolean)
            .join(", "),
        labelPrevious: () => "Go to previous month",
        labelNext: () => "Go to next month",
        ...labels,
      }}
      components={{
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...(props as DayPickerProps)}
    />
  );
}

function CalendarChevron({
  orientation,
  className,
}: {
  orientation?: "up" | "down" | "left" | "right";
  className?: string;
}) {
  const Icon =
    orientation === "left"
      ? ChevronLeft
      : orientation === "up"
        ? ChevronUp
        : orientation === "down"
          ? ChevronDown
          : ChevronRight;
  return <Icon aria-hidden="true" className={cn("size-4", className)} />;
}

/** Day button styled from react-day-picker's modifiers (selected, range, today, outside). */
export function CalendarDayButton({ day: _day, modifiers, className, ...props }: DayButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const rangeEdge = modifiers.range_start || modifiers.range_end;
  const filled = (modifiers.selected && !modifiers.range_middle) || rangeEdge;

  return (
    <button
      ref={ref}
      data-slot="calendar-day"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md text-sm font-normal tabular-nums",
        "ease-standard hover:bg-muted transition-colors duration-(--duration-fast)",
        "focus-visible:ring-ring focus-visible:relative focus-visible:z-(--z-raised) focus-visible:ring-2 focus-visible:outline-none",
        "disabled:text-muted-foreground disabled:pointer-events-none disabled:line-through disabled:opacity-50",
        modifiers.outside && "text-muted-foreground",
        modifiers.today && "text-accent font-semibold",
        modifiers.range_middle && "text-secondary-foreground hover:bg-surface/40 rounded-none",
        filled && "bg-primary text-primary-foreground hover:bg-primary/90",
        className,
      )}
      {...props}
    />
  );
}

export type { DateRange, Matcher } from "react-day-picker";
