import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../../lib/cn";

export const descriptionListVariants = cva("text-sm", {
  variants: {
    layout: {
      /** Term beside its details on wider screens, stacked on small ones. */
      horizontal:
        "divide-y [&>div]:grid [&>div]:gap-1 [&>div]:py-3 sm:[&>div]:grid-cols-3 sm:[&>div]:gap-4",
      /** Term above its details. */
      vertical: "grid gap-4",
      /** Compact pairs in columns, e.g. a summary card. */
      grid: "grid gap-x-6 gap-y-4 sm:grid-cols-2",
    },
  },
  defaultVariants: { layout: "horizontal" },
});

/** Key–value details: a domain's registrar and expiry, a server's IP and region. */
export function DescriptionList({
  className,
  layout,
  ...props
}: React.ComponentProps<"dl"> & VariantProps<typeof descriptionListVariants>) {
  return (
    <dl
      data-slot="description-list"
      data-layout={layout ?? "horizontal"}
      className={cn(descriptionListVariants({ layout }), className)}
      {...props}
    />
  );
}

/** One term + details pair (a `div`, valid inside `dl`). */
export function DescriptionItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="description-item" className={cn("grid gap-1", className)} {...props} />;
}

export function DescriptionTerm({ className, ...props }: React.ComponentProps<"dt">) {
  return (
    <dt
      data-slot="description-term"
      className={cn("text-muted-foreground font-medium", className)}
      {...props}
    />
  );
}

export function DescriptionDetails({ className, ...props }: React.ComponentProps<"dd">) {
  return (
    <dd
      data-slot="description-details"
      className={cn("text-foreground min-w-0 break-words sm:col-span-2", className)}
      {...props}
    />
  );
}
