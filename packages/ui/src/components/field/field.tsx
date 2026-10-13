import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { useId, useLayoutEffect, useMemo, useState } from "react";
import type * as React from "react";
import { cn } from "../../lib/cn";
import {
  FieldContext,
  useFieldContext,
  useFieldControlProps,
  type FieldContextValue,
} from "../../lib/field-context";
import { Label } from "../label";

export { useFieldControlProps };

export const fieldVariants = cva("group/field flex gap-2", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal:
        "flex-row flex-wrap items-center gap-x-3 gap-y-1 [&>[data-slot=field-description]]:basis-full [&>[data-slot=field-error]]:basis-full",
    },
  },
  defaultVariants: { orientation: "vertical" },
});

export interface FieldProps
  extends React.ComponentProps<"div">, VariantProps<typeof fieldVariants> {
  /** Marks the control invalid and shows `FieldError`. */
  invalid?: boolean;
  disabled?: boolean;
  /** Sets aria-required on the control and shows an indicator on the label. */
  required?: boolean;
}

/**
 * Wraps a label, a control, a description and an error, and wires them together:
 * the control gets `id`, `aria-describedby`, `aria-invalid` and `aria-required` automatically.
 * To choose the control's id, set `id` on the Field (not on the control).
 *
 * <Field invalid={!!error} required>
 *   <FieldLabel>Amount</FieldLabel>
 *   <Input />
 *   <FieldDescription>Minimum ৳100</FieldDescription>
 *   <FieldError>{error}</FieldError>
 * </Field>
 */
export function Field({
  id,
  invalid = false,
  disabled = false,
  required = false,
  orientation,
  className,
  ...props
}: FieldProps) {
  const autoId = useId();
  const controlId = id ?? `field-${autoId}`;
  const [hasDescription, setHasDescription] = useState(false);
  const [hasError, setHasError] = useState(false);

  const value = useMemo<FieldContextValue>(
    () => ({
      controlId,
      labelId: `${controlId}-label`,
      descriptionId: `${controlId}-description`,
      errorId: `${controlId}-error`,
      invalid,
      disabled,
      required,
      hasDescription,
      hasError,
      setHasDescription,
      setHasError,
    }),
    [controlId, invalid, disabled, required, hasDescription, hasError],
  );

  return (
    <FieldContext.Provider value={value}>
      <div
        data-slot="field"
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
        className={cn(fieldVariants({ orientation }), className)}
        {...props}
      />
    </FieldContext.Provider>
  );
}

export function FieldLabel({ className, children, ...props }: React.ComponentProps<typeof Label>) {
  const field = useFieldContext();
  return (
    <Label
      data-slot="field-label"
      id={field?.labelId}
      htmlFor={field?.controlId}
      className={cn(field?.disabled && "opacity-50", className)}
      {...props}
    >
      {children}
      {field?.required && (
        <span aria-hidden="true" className="text-danger">
          *
        </span>
      )}
    </Label>
  );
}

export function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  const field = useFieldContext();
  const setHasDescription = field?.setHasDescription;
  useLayoutEffect(() => {
    setHasDescription?.(true);
    return () => setHasDescription?.(false);
  }, [setHasDescription]);

  return (
    <p
      data-slot="field-description"
      id={field?.descriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

/**
 * Error message, shown only while the Field is invalid. The element stays mounted as a polite
 * live region so screen readers announce the message when it appears.
 */
export function FieldError({ className, children, ...props }: React.ComponentProps<"p">) {
  const field = useFieldContext();
  const setHasError = field?.setHasError;
  useLayoutEffect(() => {
    setHasError?.(true);
    return () => setHasError?.(false);
  }, [setHasError]);

  const visible = field ? field.invalid : true;

  return (
    <p
      data-slot="field-error"
      id={field?.errorId}
      aria-live="polite"
      className={cn("text-danger text-sm font-medium empty:hidden", className)}
      {...props}
    >
      {visible ? children : null}
    </p>
  );
}

/** Passes Field wiring to a control that isn't part of Nukta UI. */
export function FieldControl(props: React.ComponentProps<typeof Slot.Root>) {
  return <Slot.Root data-slot="field-control" {...useFieldControlProps(props)} />;
}
