import type * as React from "react";
import { cn } from "../../lib/cn";

/** Loading placeholder. Hidden from assistive tech; announce loading state on the container. */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  );
}
