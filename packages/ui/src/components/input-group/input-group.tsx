import { cva, type VariantProps } from "class-variance-authority";
import { createContext, useContext } from "react";
import type * as React from "react";
import { cn } from "../../lib/cn";
import { Button, type ButtonProps } from "../button";
import { Input, type InputProps } from "../input";

type InputGroupSize = "sm" | "md" | "lg";
const InputGroupContext = createContext<InputGroupSize>("md");

export const inputGroupVariants = cva(
  [
    "group/input-group border-input bg-surface text-surface-foreground flex w-full min-w-0 items-stretch overflow-hidden rounded-md border shadow-xs",
    "ease-standard transition duration-(--duration-fast)",
    // The group carries Input's focus ring and invalid border, driven by the inner input.
    "has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-ring/40 has-[input:focus-visible]:ring-2",
    "has-[input[aria-invalid=true]]:border-danger has-[input[aria-invalid=true]:focus-visible]:ring-danger/40",
    "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50",
  ],
  {
    variants: {
      size: {
        sm: "h-8 text-sm",
        md: "h-10 text-sm",
        lg: "h-11 text-base",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface InputGroupProps
  extends React.ComponentProps<"div">, VariantProps<typeof inputGroupVariants> {}

/**
 * An Input with text, icon or button addons, e.g. a currency prefix.
 *
 * <InputGroup>
 *   <InputGroupAddon>৳</InputGroupAddon>
 *   <InputGroupInput inputMode="decimal" />
 *   <InputGroupAddon align="end">BDT</InputGroupAddon>
 * </InputGroup>
 */
export function InputGroup({ className, size, ...props }: InputGroupProps) {
  return (
    <InputGroupContext.Provider value={size ?? "md"}>
      <div
        data-slot="input-group"
        role="group"
        className={cn(inputGroupVariants({ size }), className)}
        {...props}
      />
    </InputGroupContext.Provider>
  );
}

/** The input inside an InputGroup: borderless, sized by the group, Field-aware like Input. */
export function InputGroupInput({ className, ...props }: Omit<InputProps, "size">) {
  const size = useContext(InputGroupContext);
  return (
    <Input
      data-slot="input-group-input"
      size={size}
      className={cn(
        "h-full flex-1 rounded-none border-0 bg-transparent shadow-none",
        "focus-visible:ring-0 aria-invalid:focus-visible:ring-0",
        className,
      )}
      {...props}
    />
  );
}

export const inputGroupAddonVariants = cva(
  "text-muted-foreground flex shrink-0 items-center gap-1.5 select-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      align: {
        start: "order-first pl-3 has-[button]:pl-1",
        end: "order-last pr-3 has-[button]:pr-1",
      },
    },
    defaultVariants: { align: "start" },
  },
);

export interface InputGroupAddonProps
  extends React.ComponentProps<"div">, VariantProps<typeof inputGroupAddonVariants> {}

/** Text, an icon or InputGroupButtons before (`start`) or after (`end`) the input. */
export function InputGroupAddon({ className, align, onClick, ...props }: InputGroupAddonProps) {
  return (
    // Click-to-focus is a pointer convenience only; keyboard users reach the input directly with
    // Tab, so the addon must not become a tab stop or an interactive role.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      data-slot="input-group-addon"
      data-align={align ?? "start"}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(event) => {
        onClick?.(event);
        // Clicking a text or icon addon focuses the input, like clicking inside a field.
        if (!event.defaultPrevented && !(event.target as HTMLElement).closest("button")) {
          event.currentTarget
            .closest("[data-slot=input-group]")
            ?.querySelector<HTMLInputElement>("input")
            ?.focus();
        }
      }}
      {...props}
    />
  );
}

/** A compact ghost button sized to the group, e.g. clear, show password, copy. */
export function InputGroupButton({
  className,
  variant = "ghost",
  size: _size,
  ...props
}: ButtonProps) {
  const size = useContext(InputGroupContext);
  return (
    <Button
      data-slot="input-group-button"
      variant={variant}
      size="icon"
      className={cn(
        size === "sm" ? "size-6" : size === "lg" ? "size-9" : "size-8",
        "rounded-sm [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}
