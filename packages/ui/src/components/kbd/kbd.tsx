import type * as React from "react";
import { cn } from "../../lib/cn";

/** A keyboard key, e.g. <Kbd>⌘</Kbd><Kbd>K</Kbd>. Give symbols a readable `title`/`aria-label`. */
export function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "bg-muted inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded-sm border px-1",
        "text-muted-foreground font-sans text-xs font-medium select-none [&_svg]:size-3",
        className,
      )}
      {...props}
    />
  );
}

/** Groups keys of one shortcut, e.g. Ctrl + B. */
export function KbdGroup({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}
