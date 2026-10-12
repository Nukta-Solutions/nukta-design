---
"@nukta-solutions/ui": minor
---

New components for billing and product dashboards:

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
