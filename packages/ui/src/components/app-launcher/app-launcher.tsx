import { cva } from "class-variance-authority";
import { Grip } from "lucide-react";
import type * as React from "react";
import { cn } from "../../lib/cn";
import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import type { Product } from "../sidebar";

export const appLauncherItemVariants = cva(
  [
    "flex flex-col items-center gap-2 rounded-md p-3 text-center text-xs font-medium",
    "ease-standard hover:bg-muted transition-colors duration-(--duration-fast)",
    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
    "aria-[current=page]:bg-secondary aria-[current=page]:text-secondary-foreground",
  ],
  {
    variants: {
      tile: {
        brand:
          "[&_[data-slot=app-launcher-icon]]:bg-primary [&_[data-slot=app-launcher-icon]]:text-primary-foreground",
        plain:
          "[&_[data-slot=app-launcher-icon]]:bg-muted [&_[data-slot=app-launcher-icon]]:text-foreground",
      },
    },
    defaultVariants: { tile: "brand" },
  },
);

export interface AppLauncherProps {
  products: Product[];
  /** Id of the product this app is; it's marked as the current page. */
  currentId?: string;
  /** Accessible name of the button and heading of the panel. Default "Nukta apps". */
  label?: string;
  /** Background of the icon tiles. Use "plain" when the icons are full-color logos. */
  tile?: "brand" | "plain";
  /** Extra content under the grid, e.g. a link to all products. */
  footer?: React.ReactNode;
  /** Classes for the trigger button. */
  className?: string;
}

/**
 * The grid button in the top-right corner of every Nukta app, next to the `AccountMenu`. It opens
 * a panel that links to each Nukta product (Account, Domains, Mail…), like Google's app launcher.
 */
export function AppLauncher({
  products,
  currentId,
  label = "Nukta apps",
  tile = "brand",
  footer,
  className,
}: AppLauncherProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          data-slot="app-launcher"
          variant="ghost"
          size="icon"
          aria-label={label}
          className={cn("rounded-full", className)}
        >
          <Grip aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-2" data-slot="app-launcher-content">
        <nav aria-label={label}>
          <h2 className="text-muted-foreground px-2 pt-1 pb-2 text-xs font-medium">{label}</h2>
          <ul className="grid grid-cols-3 gap-1">
            {products.map((product) => {
              const isCurrent = product.id === currentId;
              return (
                <li key={product.id}>
                  <a
                    href={product.href}
                    title={product.description}
                    aria-current={isCurrent ? "page" : undefined}
                    className={appLauncherItemVariants({ tile })}
                  >
                    <span
                      data-slot="app-launcher-icon"
                      aria-hidden="true"
                      className="flex size-10 items-center justify-center rounded-lg [&>svg]:size-5"
                    >
                      {product.icon}
                    </span>
                    <span className="line-clamp-2">{product.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
          {footer && <div className="mt-2 border-t px-2 pt-2 text-sm">{footer}</div>}
        </nav>
      </PopoverContent>
    </Popover>
  );
}
