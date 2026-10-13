import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../../lib/cn";
import { useFieldControlProps } from "../../lib/field-context";

/** Shared field styles, also used by Textarea and Select. */
export const fieldBase = [
  "w-full min-w-0 rounded-md border border-input bg-surface text-surface-foreground shadow-xs",
  "transition duration-(--duration-fast) ease-standard",
  "placeholder:text-muted-foreground",
  "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none",
  "aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/40",
  "disabled:cursor-not-allowed disabled:opacity-50",
];

export const inputVariants = cva(
  [
    ...fieldBase,
    "file:text-foreground file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium",
  ],
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 text-sm",
        md: "h-10 px-3 text-sm",
        lg: "h-11 px-4 text-base",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">, VariantProps<typeof inputVariants> {}

/** Single-line text field. Pair with `<Label htmlFor>`; set `aria-invalid` to show an error. */
export function Input({ className, size, type = "text", ...rest }: InputProps) {
  const props = useFieldControlProps(rest);
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  );
}
