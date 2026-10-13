import { createContext, useContext, useId } from "react";
import type * as React from "react";
import * as Recharts from "recharts";
import { cn } from "../../lib/cn";

type ChartColor = "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5";

/** Series in a chart: label for tooltips/legends and a chart color token. */
export type ChartConfig = Record<
  string,
  { label: string; color?: ChartColor; icon?: React.ComponentType }
>;

const ChartContext = createContext<ChartConfig | null>(null);

/** The surrounding ChartContainer's config, or an explicit one passed to a part. */
function useChartConfig(override?: ChartConfig): ChartConfig {
  const context = useContext(ChartContext);
  return override ?? context ?? {};
}

export interface ChartContainerProps extends Omit<React.ComponentProps<"figure">, "title"> {
  config: ChartConfig;
  /** Accessible name of the chart (visually hidden). */
  title: string;
  /**
   * Text alternative: the key takeaway, e.g. "Sends grew 18% in October". Visually hidden,
   * announced with the chart. Also offer the data as a table or text where it matters.
   */
  description?: string;
  /** A Recharts chart, e.g. <BarChart>. It fills the container. */
  children: React.ComponentProps<typeof Recharts.ResponsiveContainer>["children"];
}

/**
 * Wraps a Recharts chart: sets series colors from tokens (use `var(--color-<key>)` in your
 * chart), styles axes, grid and cursor with tokens, and gives the chart a name and description.
 * Size it with classes, e.g. `className="h-64"`.
 */
export function ChartContainer({
  config,
  title,
  description,
  className,
  style,
  children,
  ...props
}: ChartContainerProps) {
  const descriptionId = useId();
  const colorVars = Object.fromEntries(
    Object.entries(config)
      .filter(([, series]) => series.color)
      .map(([key, series]) => [`--color-${key}`, `var(--color-${series.color})`]),
  );

  return (
    <ChartContext.Provider value={config}>
      <figure
        data-slot="chart"
        aria-label={title}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "relative m-0 flex aspect-video w-full justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          "[&_.recharts-cartesian-grid_line]:stroke-border [&_.recharts-reference-line_line]:stroke-border",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted",
          "[&_.recharts-polar-grid_line]:stroke-border [&_.recharts-polar-grid_path]:stroke-border",
          "[&_.recharts-layer]:outline-none [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        style={{ ...colorVars, ...style }}
        {...props}
      >
        {description && (
          <figcaption id={descriptionId} className="sr-only">
            {description}
          </figcaption>
        )}
        <Recharts.ResponsiveContainer>{children}</Recharts.ResponsiveContainer>
      </figure>
    </ChartContext.Provider>
  );
}

export const ChartTooltip = Recharts.Tooltip;
export const ChartLegend = Recharts.Legend;

type TooltipItem = {
  dataKey?: string | number | ((obj: unknown) => unknown);
  name?: string | number;
  value?: unknown;
  color?: string;
};

export interface ChartTooltipContentProps {
  active?: boolean;
  payload?: readonly TooltipItem[];
  label?: React.ReactNode;
  /** Formats values, e.g. currency. */
  valueFormatter?: (value: number) => string;
  labelFormatter?: (label: React.ReactNode) => React.ReactNode;
  hideLabel?: boolean;
  /** Defaults to the surrounding ChartContainer's config. */
  config?: ChartConfig;
  className?: string;
}

/** Tooltip styled with tokens. Use as `<ChartTooltip content={<ChartTooltipContent />} />`. */
export function ChartTooltipContent({
  active,
  payload,
  label,
  valueFormatter = (value) => value.toLocaleString(),
  labelFormatter,
  hideLabel = false,
  config: configProp,
  className,
}: ChartTooltipContentProps) {
  const config = useChartConfig(configProp);
  if (!active || !payload?.length) return null;

  return (
    <div
      data-slot="chart-tooltip"
      className={cn(
        "bg-surface text-surface-foreground grid min-w-32 gap-1.5 rounded-md border px-2.5 py-1.5 text-xs shadow-lg",
        className,
      )}
    >
      {!hideLabel && label != null && (
        <div className="font-medium">{labelFormatter ? labelFormatter(label) : label}</div>
      )}
      {payload.map((item) => {
        const key = String(item.dataKey ?? item.name ?? "");
        const series = config[key];
        return (
          <div key={key} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-xs"
              style={{ backgroundColor: item.color ?? `var(--color-${key})` }}
            />
            <span className="text-muted-foreground">{series?.label ?? item.name}</span>
            <span className="ml-auto font-medium tabular-nums">
              {typeof item.value === "number"
                ? valueFormatter(item.value)
                : String(item.value ?? "")}
            </span>
          </div>
        );
      })}
    </div>
  );
}

type LegendItem = { dataKey?: unknown; value?: unknown; color?: string };

export interface ChartLegendContentProps {
  payload?: readonly LegendItem[];
  /** Defaults to the surrounding ChartContainer's config. */
  config?: ChartConfig;
  className?: string;
}

/** Legend styled with tokens. Use as `<ChartLegend content={<ChartLegendContent />} />`. */
export function ChartLegendContent({
  payload,
  config: configProp,
  className,
}: ChartLegendContentProps) {
  const config = useChartConfig(configProp);
  if (!payload?.length) return null;
  return (
    <ul
      data-slot="chart-legend"
      className={cn("flex flex-wrap items-center justify-center gap-4 pt-3", className)}
    >
      {payload.map((item) => {
        const key = String(item.dataKey ?? item.value ?? "");
        const series = config[key];
        const Icon = series?.icon;
        return (
          <li key={key} className="flex items-center gap-1.5">
            {Icon ? (
              <Icon />
            ) : (
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-xs"
                style={{ backgroundColor: item.color ?? `var(--color-${key})` }}
              />
            )}
            <span className="text-muted-foreground">
              {series?.label ?? String(item.value ?? key)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
