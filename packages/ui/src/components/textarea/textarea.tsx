import type * as React from "react";
import { cn } from "../../lib/cn";
import { useFieldControlProps } from "../../lib/field-context";
import { fieldBase } from "../input/input";

export type TextareaProps = React.ComponentProps<"textarea">;

/** Multi-line text field that grows with its content where supported (`field-sizing: content`). */
export function Textarea({ className, ...rest }: TextareaProps) {
  const props = useFieldControlProps(rest);
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldBase, "field-sizing-content min-h-20 px-3 py-2 text-sm", className)}
      {...props}
    />
  );
}
