import { Check, ChevronsUpDown } from "lucide-react";
import { useId, useState } from "react";
import type * as React from "react";
import { cn } from "../../lib/cn";
import { useFieldContext, useFieldControlProps } from "../../lib/field-context";
import { useControllableState } from "../../lib/use-controllable-state";
import { Badge } from "../badge";
import { Button } from "../button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

export interface ComboboxOption {
  value: string;
  label: string;
  /** Secondary text shown under the label. */
  description?: string;
  /** Extra words that match the search, e.g. a country code. */
  keywords?: string[];
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface ComboboxBaseProps {
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: React.ReactNode;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  /** Width of the dropdown; defaults to the trigger width. */
  contentClassName?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
}

export interface ComboboxSingleProps extends ComboboxBaseProps {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
}

export interface ComboboxMultipleProps extends ComboboxBaseProps {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Badges shown in the trigger before collapsing to "+N". Default 2. */
  maxBadges?: number;
}

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

/** Searchable select for long lists, single or multiple. Field-aware. */
export function Combobox(props: ComboboxProps) {
  const {
    options,
    placeholder = "Select…",
    searchPlaceholder = "Search…",
    emptyText = "No results.",
    size = "md",
    open: openProp,
    onOpenChange,
    className,
    contentClassName,
    multiple,
    value: _value,
    defaultValue: _defaultValue,
    onValueChange: _onValueChange,
    ...rest
  } = props;
  const maxBadges = props.multiple ? (props.maxBadges ?? 2) : 0;

  const [open, setOpen] = useControllableState(openProp, false, onOpenChange);
  const [selected, setSelected] = useControllableState<string[]>(
    props.value === undefined ? undefined : toArray(props.value),
    toArray(props.defaultValue),
    (next) => {
      if (props.multiple) props.onValueChange?.(next);
      else props.onValueChange?.(next[0]);
    },
  );
  const [search, setSearch] = useState("");
  const listId = useId();

  const selectedOptions = selected
    .map((v) => options.find((o) => o.value === v))
    .filter((o): o is ComboboxOption => !!o);

  const toggle = (value: string) => {
    if (multiple) {
      setSelected(
        selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value],
      );
    } else {
      setSelected(selected[0] === value ? [] : [value]);
      setOpen(false);
    }
  };

  const text =
    !multiple && selectedOptions[0] ? (
      <span className="truncate">{selectedOptions[0].label}</span>
    ) : multiple && selectedOptions.length ? (
      // Badges may collapse to "+N"; the full list is announced via the trigger's value text.
      <span aria-hidden="true" className="flex min-w-0 flex-wrap gap-1">
        {selectedOptions.slice(0, maxBadges).map((o) => (
          <Badge key={o.value} variant="secondary" className="max-w-32 truncate">
            {o.label}
          </Badge>
        ))}
        {selectedOptions.length > maxBadges && (
          <Badge variant="outline">+{selectedOptions.length - maxBadges}</Badge>
        )}
      </span>
    ) : null;

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSearch("");
      }}
    >
      <ComboboxTrigger
        {...rest}
        size={size}
        expanded={open}
        listId={listId}
        className={className}
        valueText={multiple ? selectedOptions.map((o) => o.label).join(", ") : ""}
        hasValue={!!multiple && selectedOptions.length > 0}
      >
        {text ?? <span className="text-muted-foreground truncate">{placeholder}</span>}
      </ComboboxTrigger>
      <PopoverContent
        align="start"
        aria-label={typeof placeholder === "string" ? placeholder : "Options"}
        className={cn("w-(--radix-popover-trigger-width) min-w-56 p-0", contentClassName)}
      >
        <Command loop>
          <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={setSearch} />
          <CommandList id={listId} aria-multiselectable={multiple || undefined}>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={[option.label, ...(option.keywords ?? [])]}
                    disabled={option.disabled}
                    data-checked={isSelected || undefined}
                    onSelect={() => toggle(option.value)}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-4 items-center justify-center",
                        multiple && "border-input rounded-sm border",
                        multiple &&
                          isSelected &&
                          "border-primary bg-primary text-primary-foreground",
                      )}
                    >
                      {isSelected && <Check className="size-3.5 text-current" />}
                    </span>
                    {option.icon}
                    <span className="grid min-w-0">
                      <span className="truncate">{option.label}</span>
                      {option.description && (
                        <span className="text-muted-foreground truncate text-xs">
                          {option.description}
                        </span>
                      )}
                    </span>
                    {isSelected && <span className="sr-only">, selected</span>}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

/** role="combobox" button, Field-aware, named by its label plus the selected value. */
function ComboboxTrigger({
  size,
  expanded,
  listId,
  valueText,
  hasValue,
  className,
  children,
  ...rest
}: Omit<
  ComboboxBaseProps,
  | "options"
  | "placeholder"
  | "searchPlaceholder"
  | "emptyText"
  | "open"
  | "onOpenChange"
  | "contentClassName"
> & {
  expanded: boolean;
  listId: string;
  valueText: string;
  hasValue: boolean;
  children: React.ReactNode;
}) {
  const field = useFieldContext();
  const valueId = useId();
  const labelTextId = useId();
  const {
    "aria-required": required,
    "aria-label": ariaLabel,
    ...props
  } = useFieldControlProps(rest);
  const labelSource = props["aria-labelledby"] ?? (ariaLabel ? labelTextId : field?.labelId);

  return (
    <PopoverTrigger asChild>
      <Button
        data-slot="combobox-trigger"
        type="button"
        variant="outline"
        size={size}
        role="combobox"
        aria-expanded={expanded}
        aria-controls={expanded ? listId : undefined}
        aria-haspopup="listbox"
        aria-required={required}
        {...props}
        aria-labelledby={labelSource ? `${labelSource} ${valueId}` : undefined}
        className={cn(
          "h-auto min-h-10 w-full justify-between gap-2 px-3 py-1.5 font-normal",
          size === "sm" && "min-h-8",
          size === "lg" && "min-h-11",
          "aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/40",
          className,
        )}
      >
        {ariaLabel && (
          <span id={labelTextId} className="sr-only">
            {ariaLabel}
          </span>
        )}
        <span id={valueId} className="flex min-w-0 flex-1 items-center text-left">
          {children}
          {hasValue && <span className="sr-only">{valueText}</span>}
        </span>
        <ChevronsUpDown aria-hidden="true" className="opacity-60" />
      </Button>
    </PopoverTrigger>
  );
}
