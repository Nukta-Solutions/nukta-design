import { Menu } from "lucide-react";
import { Slot } from "radix-ui";
import { useState } from "react";
import type * as React from "react";
import { cn } from "../../lib/cn";
import { Button } from "../button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "../sheet";

/**
 * Application layout: a sidebar on desktop, a slide-in navigation sheet on mobile, a sticky
 * header and the main content area. Router-agnostic — pass your router's links via `NavItem asChild`.
 *
 * <AppShell>
 *   <SkipLink />
 *   <AppShellSidebar>…</AppShellSidebar>
 *   <AppShellBody>
 *     <AppShellHeader><AppShellMobileNav>…</AppShellMobileNav>…</AppShellHeader>
 *     <AppShellMain>…</AppShellMain>
 *   </AppShellBody>
 * </AppShell>
 */
export function AppShell({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="app-shell" className={cn("flex min-h-dvh", className)} {...props} />;
}

/** Visually hidden until focused; lets keyboard users jump past the navigation. */
export function SkipLink({
  className,
  href = "#main",
  children = "Skip to content",
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      data-slot="skip-link"
      href={href}
      className={cn(
        "bg-primary text-primary-foreground sr-only z-(--z-tooltip) rounded-md px-4 py-2 text-sm font-medium",
        "focus-visible:ring-ring focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:outline-none focus-visible:ring-2",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

/** Desktop sidebar (hidden below the `md` breakpoint — use AppShellMobileNav there). */
export function AppShellSidebar({ className, ...props }: React.ComponentProps<"aside">) {
  return (
    <aside
      data-slot="app-shell-sidebar"
      className={cn(
        "bg-surface sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r md:flex",
        className,
      )}
      {...props}
    />
  );
}

/** Top area of the sidebar, aligned with the header height. Put the product logo here. */
export function AppShellSidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-shell-sidebar-header"
      className={cn("flex h-16 shrink-0 items-center border-b px-5", className)}
      {...props}
    />
  );
}

export function AppShellBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-shell-body"
      className={cn("flex min-w-0 flex-1 flex-col", className)}
      {...props}
    />
  );
}

export function AppShellHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="app-shell-header"
      className={cn(
        "bg-surface/80 sticky top-0 z-(--z-sticky) flex h-16 shrink-0 items-center gap-3 border-b px-4 backdrop-blur md:px-6",
        className,
      )}
      {...props}
    />
  );
}

export function AppShellMain({ className, id = "main", ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="app-shell-main"
      id={id}
      tabIndex={-1}
      className={cn("mx-auto w-full max-w-6xl flex-1 p-4 outline-none md:p-8", className)}
      {...props}
    />
  );
}

export interface AppShellMobileNavProps {
  children: React.ReactNode;
  /** Accessible name for the menu button and the sheet. */
  label?: string;
  className?: string;
}

/**
 * Menu button (mobile only) that opens the navigation in a sheet from the left.
 * Closes automatically when a link inside it is followed.
 */
export function AppShellMobileNav({
  children,
  label = "Navigation",
  className,
}: AppShellMobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Open ${label.toLowerCase()}`}
          className={cn("md:hidden", className)}
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 gap-0 p-0"
        onClickCapture={(event) => {
          if ((event.target as HTMLElement).closest("a[href]")) setOpen(false);
        }}
      >
        <SheetTitle className="sr-only">{label}</SheetTitle>
        <SheetDescription className="sr-only">Main navigation</SheetDescription>
        {children}
      </SheetContent>
    </Sheet>
  );
}

export function NavList({
  className,
  "aria-label": ariaLabel = "Main",
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="nav-list"
      aria-label={ariaLabel}
      className={cn("flex flex-1 flex-col gap-1 p-3", className)}
      {...props}
    />
  );
}

export interface NavItemProps extends React.ComponentProps<"a"> {
  /** Marks the current page (sets aria-current="page"). */
  active?: boolean;
  /** Render your router's link component instead of `<a>`. */
  asChild?: boolean;
}

/** A sidebar link. `<NavItem asChild active={…}><Link to="/">…</Link></NavItem>` */
export function NavItem({ className, active = false, asChild = false, ...props }: NavItemProps) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      data-slot="nav-item"
      aria-current={active ? "page" : undefined}
      className={cn(
        "text-muted-foreground flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
        "ease-standard hover:bg-muted hover:text-foreground transition-colors duration-(--duration-fast)",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
        "aria-[current=page]:bg-secondary aria-[current=page]:text-secondary-foreground",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

export interface PageHeaderProps extends Omit<React.ComponentProps<"div">, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Buttons shown on the right (wrap below on small screens). */
  actions?: React.ReactNode;
}

/** The page's h1, an optional description and primary actions. */
export function PageHeader({ title, description, actions, className, ...props }: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn("flex flex-wrap items-end justify-between gap-4", className)}
      {...props}
    >
      <div className="grid gap-1">
        <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
