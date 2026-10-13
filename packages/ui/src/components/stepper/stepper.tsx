import { cva } from "class-variance-authority";
import { Check, X } from "lucide-react";
import { createContext, useContext } from "react";
import type * as React from "react";
import { cn } from "../../lib/cn";

export type StepStatus = "complete" | "current" | "upcoming" | "error";

const indicatorVariants = cva(
  "relative z-(--z-raised) flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold tabular-nums",
  {
    variants: {
      status: {
        complete: "border-primary bg-primary text-primary-foreground",
        current: "border-primary bg-surface text-primary",
        upcoming: "border-input bg-surface text-muted-foreground",
        error: "border-danger bg-danger text-danger-foreground",
      },
    },
  },
);

const defaultStatusLabels: Record<StepStatus, string> = {
  complete: "Completed",
  current: "Current step",
  upcoming: "Not started",
  error: "Error",
};

const StatusLabels = createContext(defaultStatusLabels);

export interface StepperProps extends React.ComponentProps<"ol"> {
  orientation?: "horizontal" | "vertical";
  /** Screen-reader words for each status, for localization. */
  statusLabels?: Partial<Record<StepStatus, string>>;
}

/**
 * Progress through a multi-step flow, e.g. Add domain → Verify DNS → Live.
 * Display only; put navigation in your own buttons.
 */
export function Stepper({
  orientation = "horizontal",
  statusLabels,
  className,
  children,
  "aria-label": ariaLabel = "Progress",
  ...props
}: StepperProps) {
  return (
    <StatusLabels.Provider value={{ ...defaultStatusLabels, ...statusLabels }}>
      <ol
        data-slot="stepper"
        data-orientation={orientation}
        aria-label={ariaLabel}
        className={cn(
          "group/stepper flex",
          orientation === "horizontal" ? "w-full items-start" : "flex-col",
          className,
        )}
        {...props}
      >
        {children}
      </ol>
    </StatusLabels.Provider>
  );
}

export interface StepProps extends Omit<React.ComponentProps<"li">, "title"> {
  /** 1-based number shown in the circle. */
  step: number;
  status: StepStatus;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export function Step({ step, status, title, description, className, ...props }: StepProps) {
  const labels = useContext(StatusLabels);
  return (
    <li
      data-slot="step"
      data-status={status}
      aria-current={status === "current" ? "step" : undefined}
      className={cn(
        "relative flex flex-1 gap-3",
        // The connector to the next step: horizontal line, or vertical line on the left.
        "after:bg-border data-[status=complete]:after:bg-primary after:absolute last:after:hidden",
        "group-data-[orientation=horizontal]/stepper:flex-col group-data-[orientation=horizontal]/stepper:after:top-4 group-data-[orientation=horizontal]/stepper:after:right-0 group-data-[orientation=horizontal]/stepper:after:left-8 group-data-[orientation=horizontal]/stepper:after:h-0.5",
        "group-data-[orientation=vertical]/stepper:pb-6 group-data-[orientation=vertical]/stepper:after:top-8 group-data-[orientation=vertical]/stepper:after:bottom-0 group-data-[orientation=vertical]/stepper:after:left-4 group-data-[orientation=vertical]/stepper:after:w-0.5",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className={indicatorVariants({ status })}>
        {status === "complete" ? (
          <Check className="size-4" />
        ) : status === "error" ? (
          <X className="size-4" />
        ) : (
          step
        )}
      </span>
      <div className="grid gap-0.5 pr-4 group-data-[orientation=vertical]/stepper:pt-1">
        <span className="text-sm font-medium">
          <span className="sr-only">
            {labels[status]}, step {step}:{" "}
          </span>
          {title}
        </span>
        {description && <span className="text-muted-foreground text-sm">{description}</span>}
      </div>
    </li>
  );
}
