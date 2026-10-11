# Contributing to Nukta UI

Nukta UI is shared by every Nukta product, so a change here changes all of them. These rules keep it
consistent, accessible and safe to upgrade.

## Design-system rules

### 1. Tokens only

- Components and apps use **semantic tokens only**: `bg-primary`, `text-muted-foreground`,
  `border-border`, `ring-ring`, `rounded-lg`, `shadow-md`, `z-(--z-modal)`,
  `duration-(--duration-fast)`.
- **No raw colors** (`#0282C9`, `rgb()`, `oklch()`, Tailwind palette names like `blue-500`) and
  **no arbitrary values** (`p-[13px]`, `bg-[#fff]`). The `nukta/no-hardcoded-design-values` lint
  rule flags them.
- Arbitrary _variants_ are fine (`data-[state=open]:`, `aria-[invalid=true]:`, `has-[>svg]:`), and so
  are CSS-variable shorthands (`max-h-(--radix-select-content-available-height)`).
- Need a new color or scale step? Add it to `packages/tokens/src/`, map it for **both** light and
  dark, and add a contrast pair to `contrastPairs` if text appears on it.
- A layout-only arbitrary value (such as a grid template) with no token equivalent may use an
  `eslint-disable-next-line nukta/no-hardcoded-design-values` comment, with a code comment
  explaining why. This should be rare.

### 2. Accessibility is required

- Build on a Radix primitive when one exists. Don't re-implement focus management, roving tabindex
  or dismiss logic.
- Every interactive element is reachable and usable with the keyboard, and shows a visible
  `focus-visible` ring (`ring-ring`).
- Use correct roles and names: icon-only buttons need `aria-label`; form controls need a `Label`
  (or `aria-label`). Error states use `aria-invalid` plus a message linked with `aria-describedby`.
- Never use color as the only signal. Text contrast must be at least 4.5:1, and focus rings and
  other UI boundaries at least 3:1. The token tests enforce this for token pairs; Storybook's
  Accessibility panel (axe) checks rendered stories.
- Respect `prefers-reduced-motion` (the base styles already shorten animations).

### 3. Every component needs a story and a test

- `*.stories.tsx` next to the component, titled `Components/<Name>`, covering each variant, size and
  state (disabled, invalid, loading…).
- `*.test.tsx` that checks the ARIA role and name, keyboard behavior and ref forwarding, using
  Testing Library queries by role, not by class name.
- Check the story's Accessibility panel in **light and dark** before opening a PR.

### 4. Component API conventions

- Typed props that extend the underlying element (`React.ComponentProps<"button">` or the Radix
  part's props). Always accept `className` and spread the remaining props.
- Variants live in `cva` and are exported (`buttonVariants`) so apps can style links and the like.
- Merge classes with `cn()` so consumers can override them.
- Add `data-slot="<part-name>"` on every part, for styling hooks and tests.
- Use `asChild` (Radix `Slot`) to render as another element instead of adding `href`-style props.
- Use `lucide-react` icons, always with `aria-hidden="true"` when decorative.

### 5. Versioning

- Use Conventional Commits: `feat(ui): add Popover`, `fix(tokens): raise muted-foreground contrast`.
- Every PR that touches a published package includes a changeset (`pnpm changeset`):
  - **patch**: bug fixes and visual tweaks that don't change the API.
  - **minor**: new components, new props or variants, new tokens.
  - **major**: renamed or removed props, components or tokens, or behavior changes apps must
    adapt to.

## Before opening a PR

```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build
```
