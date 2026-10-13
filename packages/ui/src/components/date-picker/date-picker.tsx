import { CalendarIcon } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import type * as React from "react";
import { cn } from "../../lib/cn";
import { addDays, endOfMonth, isSameDay, startOfDay, startOfMonth } from "../../lib/date";
import { useFieldContext, useFieldControlProps } from "../../lib/field-context";
import { DEFAULT_LOCALE, dateFormat } from "../../lib/intl";
import { useControllableState } from "../../lib/use-controllable-state";
import { Button } from "../button";
import { Calendar, type DateRange, type Matcher } from "../calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

interface PickerBaseProps {
  /** BCP 47 locale for the trigger text and the calendar, e.g. "en-GB" (default) or "bn-BD". */
  locale?: string;
  /** Intl options for the trigger text. Default: "12 Oct 2026". */
  formatOptions?: Intl.DateTimeFormatOptions;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  /** Dates that can't be picked, e.g. `{ dayOfWeek: [5] }` or `[holiday1, holiday2]`. */
  disabledDates?: Matcher | Matcher[];
  /** First day of the week, 0 = Sunday … 6 = Saturday (default). */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Popover alignment relative to the trigger. */
  align?: "start" | "center" | "end";
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

/** Shared trigger: outline button with a calendar icon, Field-aware, value included in its name. */
function PickerTrigger({
  text,
  placeholder,
  size = "md",
  className,
  ...rest
}: Omit<
  PickerBaseProps,
  | "locale"
  | "formatOptions"
  | "minDate"
  | "maxDate"
  | "disabledDates"
  | "weekStartsOn"
  | "open"
  | "onOpenChange"
  | "align"
> & {
  text: string | null;
} & React.ComponentProps<"button">) {
  const field = useFieldContext();
  const valueId = useId();
  const labelTextId = useId();
  // Buttons don't support aria-required; the label's indicator conveys it instead.
  const {
    "aria-required": _required,
    "aria-label": ariaLabel,
    ...props
  } = useFieldControlProps(rest);
  // The accessible name is the label followed by the visible value ("Due date 14 Oct 2026"),
  // so speech-input users can say what they see.
  const labelSource = props["aria-labelledby"] ?? (ariaLabel ? labelTextId : field?.labelId);
  const labelledBy = labelSource ? `${labelSource} ${valueId}` : undefined;

  return (
    <PopoverTrigger asChild>
      <Button
        data-slot="date-picker-trigger"
        variant="outline"
        size={size}
        {...props}
        aria-labelledby={labelledBy}
        className={cn(
          "w-full justify-start px-3 font-normal",
          "aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/40",
          className,
        )}
      >
        {ariaLabel && (
          <span id={labelTextId} className="sr-only">
            {ariaLabel}
          </span>
        )}
        <CalendarIcon aria-hidden="true" className="text-muted-foreground" />
        <span id={valueId} className={cn("truncate", !text && "text-muted-foreground")}>
          {text ?? placeholder}
        </span>
      </Button>
    </PopoverTrigger>
  );
}

export interface DatePickerProps extends PickerBaseProps {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
}

/** A button that opens a Calendar to pick one date. Controlled (`value`) or uncontrolled. */
export function DatePicker({
  value,
  defaultValue,
  onValueChange,
  locale = DEFAULT_LOCALE,
  formatOptions = DEFAULT_FORMAT,
  placeholder = "Pick a date",
  minDate,
  maxDate,
  disabledDates,
  weekStartsOn,
  open: openProp,
  onOpenChange,
  align = "start",
  ...triggerProps
}: DatePickerProps) {
  const [date, setDate] = useControllableState<Date | undefined>(
    value,
    defaultValue,
    onValueChange,
  );
  const [open, setOpen] = useControllableState(openProp, false, onOpenChange);
  const text = date ? dateFormat(locale, formatOptions).format(date) : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PickerTrigger text={text} placeholder={placeholder} {...triggerProps} />
      <PopoverContent className="w-auto p-0" align={align} aria-label={placeholder}>
        <Calendar
          mode="single"
          // Date-picker dialog pattern (WAI-ARIA APG): focus moves to the selected day on open.
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          selected={date}
          defaultMonth={date ?? minDate}
          onSelect={(next) => {
            setDate(next);
            if (next) setOpen(false);
          }}
          locale={locale}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabledDates}
          weekStartsOn={weekStartsOn}
        />
      </PopoverContent>
    </Popover>
  );
}

export interface DateRangePreset {
  /** Stable key, e.g. "last-7-days". */
  key: string;
  label: string;
  range: DateRange;
}

/** Today, Last 7 days, Last 30 days, This month and Last month, relative to `now`. */
export function getDefaultDateRangePresets(now: Date = new Date()): DateRangePreset[] {
  const today = startOfDay(now);
  return [
    { key: "today", label: "Today", range: { from: today, to: today } },
    { key: "last-7-days", label: "Last 7 days", range: { from: addDays(today, -6), to: today } },
    { key: "last-30-days", label: "Last 30 days", range: { from: addDays(today, -29), to: today } },
    { key: "this-month", label: "This month", range: { from: startOfMonth(today), to: today } },
    {
      key: "last-month",
      label: "Last month",
      range: { from: startOfMonth(today, -1), to: endOfMonth(today, -1) },
    },
  ];
}

export interface DateRangePickerProps extends PickerBaseProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  /** `true` shows the default presets; pass your own list to customize; `false` hides them. */
  presets?: boolean | DateRangePreset[];
  /** Label of the preset shown when the range matches none. */
  customLabel?: string;
  /** Reference date for the default presets (useful for tests and stories). */
  now?: Date;
  /** Months shown side by side. Default 2. */
  numberOfMonths?: number;
}

/** A button that opens a Calendar to pick a date range, with optional quick presets. */
export function DateRangePicker({
  value,
  defaultValue,
  onValueChange,
  presets = false,
  customLabel = "Custom",
  now,
  numberOfMonths = 2,
  locale = DEFAULT_LOCALE,
  formatOptions = DEFAULT_FORMAT,
  placeholder = "Pick a date range",
  minDate,
  maxDate,
  disabledDates,
  weekStartsOn,
  open: openProp,
  onOpenChange,
  align = "start",
  ...triggerProps
}: DateRangePickerProps) {
  const [range, setRange] = useControllableState<DateRange | undefined>(
    value,
    defaultValue,
    onValueChange,
  );
  const [open, setOpenState] = useControllableState(openProp, false, onOpenChange);
  // Calendar clicks since opening: the popover closes once both ends were picked.
  const clicks = useRef(0);
  const [month, setMonth] = useState<Date | undefined>(undefined);

  const setOpen = (next: boolean) => {
    if (next) {
      clicks.current = 0;
      setMonth(undefined);
    }
    setOpenState(next);
  };

  const presetList = useMemo(
    () => (presets === true ? getDefaultDateRangePresets(now) : presets || []),
    [presets, now],
  );
  const activePreset = presetList.find(
    (p) => isSameDay(p.range.from, range?.from) && isSameDay(p.range.to, range?.to),
  );

  const format = dateFormat(locale, formatOptions);
  const text = range?.from
    ? range.to
      ? format.formatRange(range.from, range.to)
      : `${format.format(range.from)} – …`
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PickerTrigger text={text} placeholder={placeholder} {...triggerProps} />
      <PopoverContent
        className="flex w-auto flex-col p-0 sm:flex-row"
        align={align}
        aria-label={placeholder}
      >
        {presetList.length > 0 && (
          <div
            role="group"
            aria-label="Presets"
            data-slot="date-range-presets"
            className="flex gap-1 overflow-x-auto border-b p-2 sm:w-40 sm:flex-col sm:border-r sm:border-b-0"
          >
            {presetList.map((preset) => (
              <Button
                key={preset.key}
                variant="ghost"
                size="sm"
                aria-pressed={activePreset?.key === preset.key}
                className="aria-pressed:bg-secondary aria-pressed:text-secondary-foreground shrink-0 justify-start"
                onClick={() => {
                  setRange(preset.range);
                  setOpen(false);
                }}
              >
                {preset.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              aria-pressed={!activePreset && !!range?.from}
              className="aria-pressed:bg-secondary aria-pressed:text-secondary-foreground shrink-0 justify-start"
              onClick={() => {
                setRange(undefined);
                clicks.current = 0;
              }}
            >
              {customLabel}
            </Button>
          </div>
        )}
        <Calendar
          mode="range"
          // Date-picker dialog pattern (WAI-ARIA APG): focus moves to the selected day on open.
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          numberOfMonths={numberOfMonths}
          selected={range}
          month={month ?? range?.from ?? minDate}
          onMonthChange={setMonth}
          onSelect={(next, clickedDay) => {
            clicks.current += 1;
            // The first click after opening starts a new range instead of extending the old one.
            if (clicks.current === 1) {
              setRange({ from: clickedDay, to: undefined });
              return;
            }
            setRange(next);
            if (next?.from && next.to) setOpen(false);
          }}
          locale={locale}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabledDates}
          weekStartsOn={weekStartsOn}
        />
      </PopoverContent>
    </Popover>
  );
}
