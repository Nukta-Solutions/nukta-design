import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../../lib/cn";

export type Status = "operational" | "degraded" | "down" | "maintenance" | "pending" | "inactive";

const defaultLabels: Record<Status, string> = {
  operational: "Operational",
  degraded: "Degraded",
  down: "Down",
  maintenance: "Maintenance",
  pending: "Pending",
  inactive: "Inactive",
};

export const statusDotVariants = cva("relative inline-flex shrink-0 rounded-full", {
  variants: {
    status: {
      operational: "bg-success",
      degraded: "bg-warning",
      down: "bg-danger",
      maintenance: "bg-info",
      pending: "bg-muted-foreground",
      inactive: "bg-input",
    },
    size: { sm: "size-2", md: "size-2.5" },
  },
  defaultVariants: { status: "operational", size: "md" },
});

export interface StatusIndicatorProps
  extends Omit<React.ComponentProps<"span">, "children">, VariantProps<typeof statusDotVariants> {
  status: Status;
  /** Visible text. Defaults to the status name ("Operational", "Down"…). */
  label?: React.ReactNode;
  /** Animate the dot, e.g. for a live or in-progress state. Respects reduced motion. */
  pulse?: boolean;
}

/** A colored dot plus a text label: service health, domain status, deploy state. */
export function StatusIndicator({
  status,
  label,
  pulse = false,
  size,
  className,
  ...props
}: StatusIndicatorProps) {
  return (
    <span
      data-slot="status-indicator"
      data-status={status}
      className={cn("inline-flex items-center gap-2 text-sm", className)}
      {...props}
    >
      <span aria-hidden="true" className={statusDotVariants({ status, size })}>
        {pulse && (
          <span
            className={cn(
              "absolute inline-flex size-full animate-ping rounded-full opacity-60",
              statusDotVariants({ status, size }),
            )}
          />
        )}
      </span>
      <span>{label ?? defaultLabels[status]}</span>
    </span>
  );
}
