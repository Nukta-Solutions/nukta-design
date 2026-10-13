# @nukta-solutions/ui

## 0.3.0

### Minor Changes

- c9d892d: New components for billing and product dashboards:
  
  - `Popover`: Trigger, Content, Close, Anchor.
  - `Alert`: info, success, warning and danger variants, with an optional icon, action and dismiss
    button. Uses role="alert" for warning and danger, role="status" otherwise.
  - `Field`: FieldLabel, FieldDescription, FieldError and FieldControl, plus `useFieldControlProps`.
    Input, Textarea, SelectTrigger, Checkbox, Switch and RadioGroup now pick up `id`,
    `aria-describedby`, `aria-invalid`, `aria-required` and `disabled` from a surrounding Field.
  - `InputGroup`: InputGroupInput, InputGroupAddon and InputGroupButton, e.g. for a ৳ prefix.
  - `Calendar` (react-day-picker): single and range modes, min/max dates, disabled dates, Saturday
    week start by default, and Intl localization via `locale`.
  - `DatePicker` and `DateRangePicker`: controlled or uncontrolled, with optional range presets and
    `getDefaultDateRangePresets`.
  - `Pagination`: building blocks plus `PagePagination` (page numbers, ellipsis, rows-per-page
    Select) and `CursorPagination`. Items render as links (`getPageHref`, `renderLink`) or buttons
    (`onPageChange`). `getPageRange` is exported too.
  - `StatCard`: label, value, description, a trend shown with an icon and text, icon/action/footer
    slots, and a loading state.
  - `EmptyState`: default and compact sizes, with primary and secondary actions.
  - `Separator`: horizontal or vertical, decorative by default.
  
  Fix: `DropdownMenu` now renders above `Dialog`. It uses the popover z-index layer, like `Select`.
- 8e210ab: Data and operations components:
  
  - `DataTable` (TanStack Table 9): search, faceted filters, sortable headers, column visibility,
    row selection with bulk actions, loading and empty states, pagination, and a manual server mode.
    Type columns with `createDataTableColumnHelper`.
  - `Chart` (Recharts): `ChartContainer`, `ChartTooltip(Content)` and `ChartLegend(Content)`, using
    the new `chart-1`…`chart-5` tokens. `recharts` is an optional peer dependency: apps that use
    charts run `pnpm add recharts react-is`.
  - `Progress` and `UsageMeter`: quota usage with warning and danger levels shown as text.
  - `CopyButton` and `CopyField`: copy to clipboard, with a masked secret mode.
  - `DescriptionList`, `StatusIndicator`, `Toggle` / `ToggleGroup` and `Stepper`.
- 8e210ab: Ecosystem shell components:
  
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

### Patch Changes

- Updated dependencies [8e210ab]
- Updated dependencies [c9d892d]
  - @nukta-solutions/tokens@0.2.0

## 0.2.0

### Minor Changes

- f1e05f4: Add `Sheet` (a slide-in panel from any edge) and router-agnostic app layout components:
  `AppShell`, `AppShellSidebar`, `AppShellSidebarHeader`, `AppShellBody`, `AppShellHeader`,
  `AppShellMain`, `AppShellMobileNav` (navigation in a sheet below the `md` breakpoint), `NavList`,
  `NavItem`, `PageHeader` and `SkipLink`.
- f1e05f4: `CardTitle` now renders an `h2` instead of an `h3`, so cards directly under a page `h1` keep a
  valid heading order.

### Patch Changes

- f1e05f4: `Card` can now shrink inside grid and flex layouts (`min-w-0`), so wide content such as a `Table`
  scrolls inside the card instead of widening the page on small screens.

## 0.1.0

### Minor Changes

- 064dad5: Initial release of Nukta UI: semantic design tokens, 18 accessible components and shared config.

### Patch Changes

- Updated dependencies [064dad5]
  - @nukta-solutions/tokens@0.1.0
