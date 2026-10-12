import { cva, type VariantProps } from "class-variance-authority";
import { Progress as ProgressPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "../../lib/cn";

export const progressVariants = cva("bg-muted relative w-full overflow-hidden rounded-full", {
  variants: {
    size: { sm: "h-1.5", md: "h-2", lg: "h-3" },
  },
  defaultVariants: { size: "md" },
});

const indicatorTone = {
  default: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
} as const;

export interface ProgressProps
  extends
    React.ComponentProps<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  tone?: keyof typeof indicatorTone;
}

/**
 * A progress bar. Pass `value` (0–max), or leave it `null` for an indeterminate bar.
 * Name it with `aria-label` or `aria-labelledby`.
 */
export function Progress({
  className,
  value,
  max = 100,
  size,
  tone = "default",
  ...props
}: ProgressProps) {
  const percent = value == null ? null : Math.min(Math.max(value / max, 0), 1) * 100;
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      max={max}
      className={cn(progressVariants({ size }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "ease-standard h-full rounded-full transition-all duration-(--duration-slow)",
          indicatorTone[tone],
          percent == null && "w-1/3 animate-pulse",
        )}
        style={percent == null ? undefined : { width: `${percent}%` }}
      />
    </ProgressPrimitive.Root>
  );
}

export interface UsageMeterProps extends Omit<React.ComponentProps<"div">, "children"> {
  label: React.ReactNode;
  used: number;
  /** `null` = unlimited. */
  limit: number | null;
  /** Formats amounts, e.g. bytes → "8.2 GB". Default: Intl number. */
  formatValue?: (value: number) => string;
  /** Fractions of the limit where the meter turns warning / danger. Default 0.8 / 0.95. */
  thresholds?: { warning: number; danger: number };
  /** Text shown with the warning and danger levels (never color alone). */
  levelLabels?: { warning?: string; danger?: string; unlimited?: string };
  locale?: string;
}

/**
 * Usage against a quota, e.g. mailbox storage, bandwidth, monthly sends:
 * "8.2 GB of 10 GB · 82% · Almost full".
 */
export function UsageMeter({
  label,
  used,
  limit,
  formatValue,
  thresholds = { warning: 0.8, danger: 0.95 },
  levelLabels,
  locale = "en-GB",
  className,
  ...props
}: UsageMeterProps) {
  const format = formatValue ?? ((n: number) => new Intl.NumberFormat(locale).format(n));
  const labels = {
    warning: "Almost full",
    danger: "Limit reached",
    unlimited: "Unlimited",
    ...levelLabels,
  };
  const ratio = limit ? used / limit : 0;
  const level =
    limit == null
      ? "ok"
      : ratio >= thresholds.danger
        ? "danger"
        : ratio >= thresholds.warning
          ? "warning"
          : "ok";
  const percent = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(Math.min(ratio, 1));
  const amount =
    limit == null ? `${format(used)} · ${labels.unlimited}` : `${format(used)} of ${format(limit)}`;

  return (
    <div
      data-slot="usage-meter"
      data-level={level}
      className={cn("grid gap-2", className)}
      {...props}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground tabular-nums">
          {amount}
          {limit != null && ` · ${percent}`}
          {level !== "ok" && (
            <span
              className={cn(
                "ml-2 font-medium",
                level === "danger" ? "text-danger" : "text-warning-emphasis",
              )}
            >
              {labels[level]}
            </span>
          )}
        </span>
      </div>
      {limit != null && (
        <Progress
          value={Math.min(used, limit)}
          max={limit}
          tone={level === "ok" ? "default" : level}
          aria-label={typeof label === "string" ? label : undefined}
          aria-valuetext={`${amount}, ${percent}${level !== "ok" ? `, ${labels[level]}` : ""}`}
        />
      )}
    </div>
  );
}
