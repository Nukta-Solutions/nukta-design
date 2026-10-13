import { Check, Minus } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "../../lib/cn";
import { useFieldControlProps } from "../../lib/field-context";

export type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root>;

/** Checkbox supporting `checked`, `defaultChecked` and the `"indeterminate"` state. */
export function Checkbox({ className, ...rest }: CheckboxProps) {
  const props = useFieldControlProps(rest);
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input bg-surface grid size-4 shrink-0 place-content-center rounded-sm border shadow-xs",
        "ease-standard transition-colors duration-(--duration-fast)",
        "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
        "aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="text-current">
        {props.checked === "indeterminate" ? (
          <Minus className="size-3.5" aria-hidden="true" />
        ) : (
          <Check className="size-3.5" aria-hidden="true" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
