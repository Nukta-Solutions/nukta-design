import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import type * as React from "react";
import { cn } from "../../lib/cn";
import { Button } from "../button";

export const alertVariants = cva(
  "text-foreground relative flex w-full items-start gap-3 rounded-lg border border-l-4 p-4 text-sm",
  {
    variants: {
      variant: {
        info: "border-info/30 border-l-info bg-info/10",
        success: "border-success/30 border-l-success bg-success/10",
        warning: "border-warning/50 border-l-warning bg-warning/15",
        danger: "border-danger/30 border-l-danger bg-danger/10",
      },
    },
    defaultVariants: { variant: "info" },
  },
);

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>["variant"]>;

const defaultIcons: Record<AlertVariant, React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
};

const iconColors: Record<AlertVariant, string> = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning-emphasis",
  danger: "text-danger",
};

export interface AlertProps
  extends Omit<React.ComponentProps<"div">, "title">, VariantProps<typeof alertVariants> {
  /** Custom icon, or `false` to hide it. Defaults to an icon matching the variant. */
  icon?: React.ReactNode | false;
  /** Actions shown on the right, e.g. a "Top up" button. */
  action?: React.ReactNode;
  /** Renders a dismiss button that calls this. */
  onDismiss?: () => void;
  /** Accessible name of the dismiss button. */
  dismissLabel?: string;
}

/**
 * Inline message about the current context. `warning` and `danger` are announced immediately
 * (role="alert"); `info` and `success` politely (role="status"). Override with `role` if needed.
 */
export function Alert({
  className,
  variant,
  icon,
  action,
  onDismiss,
  dismissLabel = "Dismiss",
  role,
  children,
  ...props
}: AlertProps) {
  const tone: AlertVariant = variant ?? "info";
  const DefaultIcon = defaultIcons[tone];
  const urgent = tone === "warning" || tone === "danger";

  return (
    <div
      data-slot="alert"
      data-variant={tone}
      role={role ?? (urgent ? "alert" : "status")}
      className={cn(alertVariants({ variant: tone }), className)}
      {...props}
    >
      {icon !== false && (
        <span
          data-slot="alert-icon"
          aria-hidden="true"
          className={cn("mt-0.5 shrink-0 [&_svg]:size-4", iconColors[tone])}
        >
          {icon ?? <DefaultIcon />}
        </span>
      )}
      <div data-slot="alert-content" className="grid min-w-0 flex-1 gap-1">
        {children}
      </div>
      {action && (
        <div data-slot="alert-action" className="flex shrink-0 items-center gap-2 self-center">
          {action}
        </div>
      )}
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className="-my-1.5 -mr-1.5 size-8 shrink-0"
        >
          <X aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}

export function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("leading-snug font-semibold", className)}
      {...props}
    />
  );
}

export function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("leading-relaxed [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}
