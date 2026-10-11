import { CircleAlert, CircleCheck, Info, Loader2, TriangleAlert } from "lucide-react";
import type * as React from "react";
import { Toaster as Sonner, toast, type ToasterProps } from "sonner";

export { toast };
export type { ToasterProps };

/**
 * Render once near the root of your app, then call `toast("Saved")`, `toast.success(...)`,
 * `toast.error(...)` etc. anywhere. Toasts are announced to screen readers via an aria-live region.
 */
export function Toaster({ theme = "system", ...props }: ToasterProps) {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CircleCheck className="text-success size-4" aria-hidden="true" />,
        info: <Info className="text-info size-4" aria-hidden="true" />,
        warning: <TriangleAlert className="text-warning size-4" aria-hidden="true" />,
        error: <CircleAlert className="text-danger size-4" aria-hidden="true" />,
        loading: <Loader2 className="size-4 animate-spin" aria-hidden="true" />,
      }}
      style={
        {
          "--normal-bg": "var(--color-surface)",
          "--normal-text": "var(--color-surface-foreground)",
          "--normal-border": "var(--color-border)",
          "--border-radius": "var(--radius-lg)",
          zIndex: "var(--z-toast)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "font-sans shadow-lg",
          description: "text-muted-foreground",
          actionButton: "bg-primary! text-primary-foreground!",
          cancelButton: "bg-muted! text-muted-foreground!",
        },
      }}
      {...props}
    />
  );
}
