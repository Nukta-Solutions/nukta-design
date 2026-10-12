import { createContext, useContext } from "react";

export interface FieldContextValue {
  controlId: string;
  labelId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
  hasDescription: boolean;
  hasError: boolean;
  setHasDescription: (value: boolean) => void;
  setHasError: (value: boolean) => void;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}

interface FieldControlProps {
  id?: string;
  disabled?: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
  "aria-required"?: boolean | "true" | "false";
}

/**
 * Merges the surrounding `<Field>` state into a control's props: id, aria-describedby,
 * aria-invalid, aria-required and disabled. Props passed explicitly always win.
 * Nukta controls call this already; use it (or `<FieldControl>`) for third-party controls.
 */
export function useFieldControlProps<P extends FieldControlProps>(props: P): P {
  const field = useContext(FieldContext);
  if (!field) return props;

  const describedBy = [
    field.hasDescription ? field.descriptionId : null,
    field.invalid && field.hasError ? field.errorId : null,
    props["aria-describedby"],
  ]
    .filter(Boolean)
    .join(" ");

  return {
    ...props,
    id: props.id ?? field.controlId,
    disabled: props.disabled ?? (field.disabled || undefined),
    "aria-describedby": describedBy || undefined,
    "aria-invalid": props["aria-invalid"] ?? (field.invalid || undefined),
    "aria-required": props["aria-required"] ?? (field.required || undefined),
  };
}
