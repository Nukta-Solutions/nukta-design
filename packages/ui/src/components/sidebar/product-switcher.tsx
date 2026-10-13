import { Check, ChevronsUpDown } from "lucide-react";
import type * as React from "react";
import { cn } from "../../lib/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./sidebar";

export interface Product {
  id: string;
  name: string;
  /** Short line under the name, e.g. "Domains & DNS". */
  description?: string;
  /** Logo or icon shown in a tile. */
  icon: React.ReactNode;
  /** URL of the product's app. */
  href?: string;
}

export interface ProductSwitcherProps {
  products: Product[];
  /** Id of the product this app is. */
  currentId: string;
  /** Called when a product without `href` is chosen (or instead of following hrefs). */
  onSelect?: (product: Product) => void;
  /** Label above the list. Default "Nukta products". */
  label?: string;
  /** Extra items at the bottom, e.g. "All products" or "Create workspace". */
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Switch between Nukta products (Admin, Domain, Hosting, Mail, Nusend…) from the top of the
 * sidebar. Also works as a workspace or team switcher.
 */
export function ProductSwitcher({
  products,
  currentId,
  onSelect,
  label = "Nukta products",
  footer,
  className,
}: ProductSwitcherProps) {
  const { isMobile, state } = useSidebar();
  const current = products.find((p) => p.id === currentId) ?? products[0];
  if (!current) return null;

  return (
    <SidebarMenu className={className}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={current.name}
              className="text-foreground data-[state=open]:bg-muted"
            >
              <ProductTile>{current.icon}</ProductTile>
              <span className="grid flex-1 text-left leading-tight">
                <span className="font-display truncate font-semibold">{current.name}</span>
                {current.description && (
                  <span className="text-muted-foreground truncate text-xs">
                    {current.description}
                  </span>
                )}
              </span>
              <ChevronsUpDown aria-hidden="true" className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64"
            align="start"
            side={isMobile || state === "expanded" ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs font-medium">
              {label}
            </DropdownMenuLabel>
            {products.map((product) => {
              const isCurrent = product.id === current.id;
              const content = (
                <>
                  <ProductTile size="sm">{product.icon}</ProductTile>
                  <span className="grid min-w-0 flex-1 leading-tight">
                    <span className="truncate">{product.name}</span>
                    {product.description && (
                      <span className="text-muted-foreground truncate text-xs">
                        {product.description}
                      </span>
                    )}
                  </span>
                  {isCurrent && (
                    <>
                      <Check aria-hidden="true" className="ml-auto" />
                      <span className="sr-only">(current)</span>
                    </>
                  )}
                </>
              );
              return product.href && !onSelect ? (
                <DropdownMenuItem key={product.id} asChild>
                  <a href={product.href} aria-current={isCurrent ? "page" : undefined}>
                    {content}
                  </a>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem key={product.id} onSelect={() => onSelect?.(product)}>
                  {content}
                </DropdownMenuItem>
              );
            })}
            {footer && (
              <>
                <DropdownMenuSeparator />
                {footer}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function ProductTile({ children, size = "md" }: { children: React.ReactNode; size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "bg-primary text-primary-foreground flex shrink-0 items-center justify-center rounded-md",
        size === "md" ? "size-8 [&>svg]:size-4" : "size-6 rounded-sm [&>svg]:size-3.5",
      )}
    >
      {children}
    </span>
  );
}
