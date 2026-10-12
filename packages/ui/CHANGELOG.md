# @nukta-solutions/ui

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
