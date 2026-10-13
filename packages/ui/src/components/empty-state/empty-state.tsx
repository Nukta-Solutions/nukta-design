import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../../lib/cn";

export const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center text-balance",
  {
    variants: {
      size: {
        default: "gap-4 px-6 py-16",
        compact: "gap-3 px-4 py-8",
      },
    },
    defaultVariants: { size: "default" },
  },
);

const iconWrap = {
  default: "size-14 [&_svg]:size-7",
  compact: "size-10 [&_svg]:size-5",
} as const;

const titleSize = { default: "text-lg", compact: "text-base" } as const;

export interface EmptyStateProps
  extends Omit<React.ComponentProps<"div">, "title">, VariantProps<typeof emptyStateVariants> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  /** Heading level of the title. Default 2 (page); use 3 inside a Card or Table. */
  headingLevel?: 2 | 3 | 4;
}

/**
 * Shown when there's nothing to display yet: no transactions, no domains, no search results.
 * `compact` fits inside a Card or a table cell spanning all columns.
 */
export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  headingLevel = 2,
  size,
  className,
  children,
  ...props
}: EmptyStateProps) {
  const tone = size ?? "default";
  const Heading = `h${headingLevel}` as const;
  return (
    <div
      data-slot="empty-state"
      data-size={tone}
      className={cn(emptyStateVariants({ size }), className)}
      {...props}
    >
      {icon && (
        <div
          aria-hidden="true"
          className={cn(
            "bg-muted text-muted-foreground flex items-center justify-center rounded-full",
            iconWrap[tone],
          )}
        >
          {icon}
        </div>
      )}
      <div className="grid max-w-md gap-1.5">
        <Heading className={cn("font-display font-semibold", titleSize[tone])}>{title}</Heading>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
      {children}
      {(primaryAction || secondaryAction) && (
        <div
          data-slot="empty-state-actions"
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
