import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as React from "react";
import { cn } from "../../lib/cn";
import { Button, type ButtonProps } from "../button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../input-group";

export interface CopyButtonProps extends Omit<ButtonProps, "value" | "onCopy"> {
  /** Text copied to the clipboard. */
  value: string;
  /** Called after a successful copy. */
  onCopy?: (value: string) => void;
  /** Accessible names before and after copying. */
  labels?: { copy?: string; copied?: string };
}

/** Copies `value` to the clipboard and confirms with a check icon and a screen-reader announcement. */
export function CopyButton({
  value,
  onCopy,
  labels,
  variant = "ghost",
  size = "icon",
  className,
  onClick,
  children,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copyLabel = labels?.copy ?? "Copy";
  const copiedLabel = labels?.copied ?? "Copied";
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <>
      <Button
        data-slot="copy-button"
        variant={variant}
        size={size}
        aria-label={children ? undefined : copied ? copiedLabel : copyLabel}
        className={cn(size === "icon" && "size-8", className)}
        onClick={async (event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          await navigator.clipboard.writeText(value);
          setCopied(true);
          onCopy?.(value);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setCopied(false), 2000);
        }}
        {...props}
      >
        {copied ? (
          <Check aria-hidden="true" className="text-success" />
        ) : (
          <Copy aria-hidden="true" />
        )}
        {children}
      </Button>
      <span role="status" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </>
  );
}

export interface CopyFieldProps extends Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "value" | "defaultValue" | "onCopy"
> {
  value: string;
  /** Masks the value (API keys, passwords) with a show/hide toggle. */
  secret?: boolean;
  /** Use a monospace font, e.g. for keys and DNS records. Default true. */
  mono?: boolean;
  size?: "sm" | "md" | "lg";
  onCopy?: (value: string) => void;
  labels?: { copy?: string; copied?: string; show?: string; hide?: string };
}

/** A read-only value with a copy button, optionally masked: API keys, DNS values, SMTP hosts. */
export function CopyField({
  value,
  secret = false,
  mono = true,
  size,
  onCopy,
  labels,
  className,
  ...rest
}: CopyFieldProps) {
  // Field wiring happens inside InputGroupInput (Input), so it isn't repeated here.
  const [revealed, setRevealed] = useState(false);
  return (
    <InputGroup size={size} data-slot="copy-field">
      <InputGroupInput
        readOnly
        value={value}
        type={secret && !revealed ? "password" : "text"}
        className={cn(mono && "font-mono", "text-ellipsis", className)}
        onFocus={(event) => event.currentTarget.select()}
        {...rest}
      />
      <InputGroupAddon align="end">
        {secret && (
          <InputGroupButton
            aria-label={revealed ? (labels?.hide ?? "Hide value") : (labels?.show ?? "Show value")}
            aria-pressed={revealed}
            onClick={() => setRevealed((v) => !v)}
          >
            {revealed ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </InputGroupButton>
        )}
        <CopyButton value={value} onCopy={onCopy} labels={labels} className="rounded-sm" />
      </InputGroupAddon>
    </InputGroup>
  );
}
