import { cva, type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive, ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { createContext, useContext } from "react";
import type * as React from "react";
import { cn } from "../../lib/cn";

export const toggleVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap",
    "ease-standard hover:bg-muted hover:text-foreground transition-colors duration-(--duration-fast)",
    "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: "text-muted-foreground bg-transparent",
        outline: "border-input bg-surface text-muted-foreground border shadow-xs",
      },
      size: {
        sm: "h-8 min-w-8 px-2",
        md: "h-9 min-w-9 px-3",
        lg: "h-10 min-w-10 px-4",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/** A two-state button, e.g. Bold or "Show archived". */
export function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  );
}

const ToggleGroupContext = createContext<VariantProps<typeof toggleVariants>>({});

/**
 * A set of toggles: one choice (`type="single"`, e.g. Monthly / Yearly) or several
 * (`type="multiple"`). Arrow keys move between items. Name it with `aria-label`.
 */
export function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant ?? "default"}
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-lg",
        variant === "outline" ? "gap-0 shadow-xs" : "bg-muted p-1",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

export function ToggleGroupItem({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>) {
  const context = useContext(ToggleGroupContext);
  const resolvedVariant = context.variant ?? variant;
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({ variant: resolvedVariant, size: context.size ?? size }),
        resolvedVariant === "outline"
          ? "rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus-visible:z-(--z-raised) [&:not(:first-child)]:-ml-px"
          : "data-[state=on]:bg-surface data-[state=on]:text-surface-foreground data-[state=on]:shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
