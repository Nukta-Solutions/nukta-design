import { cva } from "class-variance-authority";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useId } from "react";
import type * as React from "react";
import { cn } from "../../lib/cn";
import { Card } from "../card";
import { Skeleton } from "../skeleton";

export type TrendDirection = "up" | "down" | "neutral";
export type TrendSentiment = "positive" | "negative" | "neutral";

export interface StatTrend {
  direction: TrendDirection;
  /** Visible text, e.g. "+12% vs last month". */
  label: React.ReactNode;
  /**
   * Whether the change is good or bad. Defaults to up = positive, down = negative.
   * Set it explicitly when "up" is bad, e.g. costs or error rates.
   */
  sentiment?: TrendSentiment;
}

export const statTrendVariants = cva(
  "inline-flex items-center gap-1 font-medium [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      sentiment: {
        positive: "text-success",
        negative: "text-danger",
        neutral: "text-muted-foreground",
      },
    },
    defaultVariants: { sentiment: "neutral" },
  },
);

const trendIcons = { up: TrendingUp, down: TrendingDown, neutral: Minus } as const;

export interface StatCardProps extends Omit<React.ComponentProps<"div">, "title"> {
  label: React.ReactNode;
  value: React.ReactNode;
  description?: React.ReactNode;
  trend?: StatTrend;
  /** Decorative icon shown before the label. */
  icon?: React.ReactNode;
  /** Header slot on the right, e.g. a menu or a link button. */
  action?: React.ReactNode;
  /** Bottom slot, e.g. "View transactions". */
  footer?: React.ReactNode;
  /** Shows skeletons instead of the value, trend and description. */
  loading?: boolean;
  /** Screen-reader words for the trend direction, for localization. */
  trendLabels?: Partial<Record<TrendDirection, string>>;
}

const defaultTrendLabels: Record<TrendDirection, string> = {
  up: "Increased",
  down: "Decreased",
  neutral: "No change",
};

/** A key metric: label, value, optional trend (icon + text, never color alone) and slots. */
export function StatCard({
  label,
  value,
  description,
  trend,
  icon,
  action,
  footer,
  loading = false,
  trendLabels,
  className,
  ...props
}: StatCardProps) {
  const labelId = useId();
  const sentiment: TrendSentiment =
    trend?.sentiment ??
    (trend?.direction === "up" ? "positive" : trend?.direction === "down" ? "negative" : "neutral");
  const TrendIcon = trend ? trendIcons[trend.direction] : null;
  const srTrend = trend ? { ...defaultTrendLabels, ...trendLabels }[trend.direction] : null;

  return (
    <Card
      data-slot="stat-card"
      role="group"
      aria-labelledby={labelId}
      aria-busy={loading || undefined}
      className={cn("gap-3 py-5", className)}
      {...props}
    >
      <div className="flex items-start justify-between gap-3 px-5">
        <p
          id={labelId}
          data-slot="stat-card-label"
          className="text-muted-foreground flex items-center gap-2 text-sm font-medium"
        >
          {icon && (
            <span aria-hidden="true" className="[&_svg]:size-4">
              {icon}
            </span>
          )}
          {label}
        </p>
        {action && <div data-slot="stat-card-action">{action}</div>}
      </div>

      <div className="grid gap-1.5 px-5">
        {loading ? (
          <>
            <span className="sr-only">Loading</span>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-40" />
          </>
        ) : (
          <>
            <p
              data-slot="stat-card-value"
              className="font-display text-2xl leading-tight font-semibold tabular-nums"
            >
              {value}
            </p>
            {(trend || description) && (
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                {trend && TrendIcon && (
                  <span
                    data-slot="stat-card-trend"
                    data-direction={trend.direction}
                    data-sentiment={sentiment}
                    className={statTrendVariants({ sentiment })}
                  >
                    <TrendIcon aria-hidden="true" />
                    <span className="sr-only">{srTrend}: </span>
                    {trend.label}
                  </span>
                )}
                {description && (
                  <span data-slot="stat-card-description" className="text-muted-foreground">
                    {description}
                  </span>
                )}
              </p>
            )}
          </>
        )}
      </div>

      {footer && (
        <div data-slot="stat-card-footer" className="border-t px-5 pt-3 text-sm">
          {footer}
        </div>
      )}
    </Card>
  );
}
