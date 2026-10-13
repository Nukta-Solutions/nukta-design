---
"@nukta-solutions/ui": minor
---

Ecosystem shell components:

- `Sidebar`, with `SidebarProvider`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`,
  `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupAction`, `SidebarGroupContent`,
  `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarMenuAction`, `SidebarMenuBadge`,
  `SidebarMenuSub*`, `SidebarTrigger`, `SidebarRail`, `SidebarInset`, `SidebarSeparator` and
  `useSidebar`.
  - Collapses to an icon rail with tooltips, or fully off-canvas; becomes a sheet on mobile.
  - ⌘/Ctrl+B toggles it, and the state is remembered in the `SIDEBAR_COOKIE_NAME` cookie.
- `ProductSwitcher`: switch between Nukta products, or workspaces, from the sidebar.
- `Command` and `CommandDialog` (cmdk) for ⌘K palettes, plus the `useKeyboardShortcut` hook.
- `Combobox`: searchable select, single or multiple, Field-aware.
- `Breadcrumb`, `Collapsible`, `Accordion`, `Kbd` and `KbdGroup`.
- `useMediaQuery` and `useIsMobile` hooks.

Changes:

- `DropdownMenu` is now non-modal by default. The page is no longer hidden from assistive tech
  or scroll-locked while a menu is open. Pass `modal` to restore the old behavior.
- `AppShell`, `AppShellSidebar`, `AppShellSidebarHeader`, `AppShellBody`, `AppShellMobileNav`,
  `NavList` and `NavItem` are deprecated in favor of the Sidebar components. They still work.
  `AppShellHeader`, `AppShellMain`, `SkipLink` and `PageHeader` stay.
