import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeft } from "lucide-react";
import { Slot } from "radix-ui";
import { createContext, useCallback, useContext, useId, useMemo, useState } from "react";
import type * as React from "react";
import { cn } from "../../lib/cn";
import { useIsMobile } from "../../lib/use-media-query";
import { useKeyboardShortcut } from "../../lib/use-keyboard-shortcut";
import { Button } from "../button";
import { Separator } from "../separator";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "../sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";

/** Cookie that remembers whether the desktop sidebar is expanded. */
export const SIDEBAR_COOKIE_NAME = "nukta_sidebar_open";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type SidebarCollapsible = "icon" | "offcanvas" | "none";

interface SidebarContextValue {
  /** Desktop: expanded or collapsed. */
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Mobile sheet. */
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  collapsible: SidebarCollapsible;
  sidebarId: string;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

/** Sidebar state and controls; use inside a SidebarProvider. */
export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
  return context;
}

function readOpenCookie(): boolean | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${SIDEBAR_COOKIE_NAME}=(true|false)`));
  return match ? match[1] === "true" : undefined;
}

export interface SidebarProviderProps extends React.ComponentProps<"div"> {
  /**
   * Initial desktop state. In SPAs it defaults to the saved cookie (or expanded).
   * With server rendering, read `SIDEBAR_COOKIE_NAME` on the server and pass it here to avoid a flash.
   */
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** How the desktop sidebar collapses. Default "icon" (a narrow icon rail). */
  collapsible?: SidebarCollapsible;
  /** Key for the ⌘/Ctrl + key toggle; `false` disables it. Default "b". */
  keyboardShortcut?: string | false;
}

/**
 * Holds sidebar state and lays out the page: <Sidebar> beside <SidebarInset>.
 *
 * <SidebarProvider>
 *   <Sidebar>…</Sidebar>
 *   <SidebarInset>
 *     <AppShellHeader><SidebarTrigger />…</AppShellHeader>
 *     <AppShellMain>…</AppShellMain>
 *   </SidebarInset>
 * </SidebarProvider>
 */
export function SidebarProvider({
  defaultOpen,
  open: openProp,
  onOpenChange,
  collapsible = "icon",
  keyboardShortcut = "b",
  className,
  children,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);
  const [internalOpen, setInternalOpen] = useState(() => defaultOpen ?? readOpenCookie() ?? true);
  const open = openProp ?? internalOpen;
  const sidebarId = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${next}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}; samesite=lax`;
    },
    [openProp, onOpenChange],
  );

  const toggleSidebar = useCallback(() => {
    if (isMobile) setOpenMobile((value) => !value);
    else if (collapsible !== "none") setOpen(!open);
  }, [isMobile, collapsible, open, setOpen]);

  useKeyboardShortcut(keyboardShortcut || "b", toggleSidebar, {
    enabled: keyboardShortcut !== false,
  });

  const value = useMemo<SidebarContextValue>(
    () => ({
      state: open || collapsible === "none" ? "expanded" : "collapsed",
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
      collapsible,
      sidebarId,
    }),
    [open, setOpen, openMobile, isMobile, toggleSidebar, collapsible, sidebarId],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        data-slot="sidebar-wrapper"
        className={cn("flex min-h-dvh w-full", className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export interface SidebarProps extends React.ComponentProps<"aside"> {
  /** Accessible name of the navigation sheet on mobile. */
  label?: string;
}

/** The sidebar: a sticky column on desktop, a slide-in sheet on mobile. */
export function Sidebar({ className, children, label = "Navigation", ...props }: SidebarProps) {
  const { isMobile, openMobile, setOpenMobile, state, collapsible, sidebarId } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          id={sidebarId}
          side="left"
          data-slot="sidebar"
          data-mobile="true"
          className="w-72 gap-0 p-0"
          // Following a link inside the sheet closes it.
          onClickCapture={(event) => {
            if ((event.target as HTMLElement).closest("a[href]")) setOpenMobile(false);
          }}
        >
          <SheetTitle className="sr-only">{label}</SheetTitle>
          <SheetDescription className="sr-only">Main navigation</SheetDescription>
          <div className="flex h-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  const collapsed = state === "collapsed";
  return (
    <aside
      id={sidebarId}
      data-slot="sidebar"
      data-state={state}
      data-collapsible={collapsed ? collapsible : undefined}
      className={cn(
        "group/sidebar bg-surface text-surface-foreground sticky top-0 flex h-dvh shrink-0 flex-col overflow-hidden border-r",
        "ease-standard w-64 transition-all duration-(--duration-normal)",
        "data-[collapsible=icon]:w-14",
        "data-[collapsible=offcanvas]:w-0 data-[collapsible=offcanvas]:border-r-0",
        className,
      )}
      {...props}
    >
      {/* Off-canvas: keep collapsed content out of the tab order. */}
      <div
        className="flex min-h-0 w-full flex-1 flex-col"
        inert={collapsed && collapsible === "offcanvas" ? true : undefined}
      >
        {children}
      </div>
    </aside>
  );
}

/** Button that toggles the sidebar (desktop collapse, mobile sheet). Shortcut: ⌘/Ctrl+B. */
export function SidebarTrigger({
  className,
  onClick,
  "aria-label": ariaLabel = "Toggle sidebar",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar, isMobile, open, openMobile, sidebarId } = useSidebar();
  return (
    <Button
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      aria-label={ariaLabel}
      aria-controls={sidebarId}
      aria-expanded={isMobile ? openMobile : open}
      className={cn("size-9", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft aria-hidden="true" />
    </Button>
  );
}

/** The main column beside the sidebar. */
export function SidebarInset({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-inset"
      className={cn("flex min-w-0 flex-1 flex-col", className)}
      {...props}
    />
  );
}

export function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

export function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("mt-auto flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

export function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator data-slot="sidebar-separator" className={cn("mx-2 w-auto", className)} {...props} />
  );
}

/** Scrollable middle area holding SidebarGroups. */
export function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-1 overflow-x-hidden overflow-y-auto",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  );
}

export function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="sidebar-group-label"
      className={cn(
        "text-muted-foreground flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none [&>svg]:size-4 [&>svg]:shrink-0",
        // In the icon rail, keep the label for screen readers only.
        "group-data-[collapsible=icon]/sidebar:sr-only",
        className,
      )}
      {...props}
    />
  );
}

/** A small button in a group's header, e.g. "Add project". Needs an aria-label. */
export function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="sidebar-group-action"
      className={cn(
        "text-muted-foreground absolute top-3.5 right-3 flex size-6 items-center justify-center rounded-md",
        "hover:bg-muted hover:text-foreground focus-visible:ring-ring transition-colors focus-visible:ring-2 focus-visible:outline-none",
        "group-data-[collapsible=icon]/sidebar:hidden [&>svg]:size-4 [&>svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="sidebar-group-content" className={cn("w-full text-sm", className)} {...props} />
  );
}

export function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
}

export function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  );
}

export const sidebarMenuButtonVariants = cva(
  [
    "peer/menu-button text-muted-foreground flex w-full items-center gap-2 overflow-hidden rounded-md px-2 text-left text-sm",
    "ease-standard hover:bg-muted hover:text-foreground transition-colors duration-(--duration-fast)",
    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "data-[active=true]:bg-secondary data-[active=true]:text-secondary-foreground data-[active=true]:font-medium",
    "data-[state=open]:hover:bg-muted",
    "[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
    // Icon rail: a square icon button; text stays available to screen readers.
    "group-data-[collapsible=icon]/sidebar:size-10 group-data-[collapsible=icon]/sidebar:justify-center group-data-[collapsible=icon]/sidebar:px-0",
    "group-data-[collapsible=icon]/sidebar:[&>span:not(:first-child)]:sr-only group-data-[collapsible=icon]/sidebar:[&>svg:not(:first-child)]:hidden",
  ],
  {
    variants: {
      size: {
        sm: "h-8 text-xs",
        md: "h-9",
        lg: "h-12 group-data-[collapsible=icon]/sidebar:size-10",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface SidebarMenuButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean;
  /** The current page or section: highlighted, and aria-current="page" on links. */
  isActive?: boolean;
  /** Shown beside the button in the icon rail. Defaults to nothing. */
  tooltip?: React.ReactNode;
}

/** A sidebar item. Put an icon first and the label in a <span>. */
export function SidebarMenuButton({
  asChild = false,
  isActive = false,
  size,
  tooltip,
  className,
  onClick,
  ...props
}: SidebarMenuButtonProps) {
  const { state, isMobile, collapsible, setOpen } = useSidebar();
  const Comp = asChild ? Slot.Root : "button";
  const iconRail = !isMobile && state === "collapsed" && collapsible === "icon";

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-active={isActive || undefined}
      aria-current={isActive && asChild ? "page" : undefined}
      className={cn(sidebarMenuButtonVariants({ size }), className)}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        // A collapsible parent in the icon rail can't show its sub-items: expand the sidebar.
        if (iconRail && props["aria-expanded"] !== undefined) setOpen(true);
      }}
      {...props}
    />
  );

  if (!tooltip || !iconRail) return button;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

/** A small button on the right of a menu item, e.g. a "…" menu. Needs an aria-label. */
export function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean; showOnHover?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="sidebar-menu-action"
      className={cn(
        "text-muted-foreground absolute top-1.5 right-1 flex size-6 items-center justify-center rounded-md",
        "hover:bg-muted hover:text-foreground focus-visible:ring-ring transition-colors focus-visible:ring-2 focus-visible:outline-none",
        "group-data-[collapsible=icon]/sidebar:hidden [&>svg]:size-4 [&>svg]:shrink-0",
        showOnHover &&
          "data-[state=open]:opacity-100 md:opacity-0 md:group-focus-within/menu-item:opacity-100 md:group-hover/menu-item:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

/** A count or status beside a menu item, e.g. unread messages. */
export function SidebarMenuBadge({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      className={cn(
        "pointer-events-none absolute top-1.5 right-1 flex h-6 min-w-6 items-center justify-center rounded-md px-1",
        "text-muted-foreground text-xs font-medium tabular-nums select-none",
        "peer-data-[active=true]/menu-button:text-secondary-foreground group-data-[collapsible=icon]/sidebar:hidden",
        className,
      )}
      {...props}
    />
  );
}

/** Nested items under a menu item (often inside a CollapsibleContent). Hidden in the icon rail. */
export function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 flex-col gap-1 border-l py-0.5 pl-2.5",
        "group-data-[collapsible=icon]/sidebar:hidden",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarMenuSubItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="sidebar-menu-sub-item" className={cn("relative", className)} {...props} />;
}

export function SidebarMenuSubButton({
  asChild = false,
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean; isActive?: boolean }) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-active={isActive || undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "text-muted-foreground flex h-8 min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 text-sm",
        "hover:bg-muted hover:text-foreground focus-visible:ring-ring transition-colors focus-visible:ring-2 focus-visible:outline-none",
        "data-[active=true]:bg-secondary data-[active=true]:text-secondary-foreground data-[active=true]:font-medium",
        "[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

/**
 * A thin strip on the sidebar's edge that toggles it with the mouse.
 * Keyboard and screen-reader users use SidebarTrigger or ⌘/Ctrl+B instead.
 */
export function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar, isMobile } = useSidebar();
  if (isMobile) return null;
  return (
    <button
      data-slot="sidebar-rail"
      type="button"
      tabIndex={-1}
      aria-hidden="true"
      title="Toggle sidebar"
      onClick={toggleSidebar}
      className={cn(
        "absolute inset-y-0 right-0 z-(--z-raised) hidden w-2 cursor-ew-resize md:block",
        "hover:after:bg-border after:absolute after:inset-y-0 after:right-0 after:w-px after:transition-colors",
        className,
      )}
      {...props}
    />
  );
}
