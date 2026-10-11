# Nukta UI

The internal design system for Nukta Solutions products. Every product installs it as packages,
so they all look and behave the same, and new projects start fast.

| Package                                      | What it is                                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [`@nukta-solutions/tokens`](packages/tokens) | Semantic design tokens as CSS variables, a Tailwind v4 `@theme`, and JSON (for Figma sync) |
| [`@nukta-solutions/ui`](packages/ui)         | Accessible React 19 components (Radix UI + Tailwind v4 + cva) that consume tokens only     |
| [`@nukta-solutions/config`](packages/config) | Shared tsconfig, ESLint flat config (with the design-token rule) and Prettier              |
| [`apps/docs`](apps/docs)                     | Storybook: every component, plus the token set                                             |
| [`templates/starter`](templates/starter)     | Next.js App Router starter, pre-wired with Nukta UI                                        |

**Brand:** primary navy `#15244F`, accent blue `#0282C9` and highlight amber `#FFBA00`, all taken
from the Nukta logo. Headings use **Clash Display**; everything else uses **Inter**. Light and dark
modes are built in.

---

## Using Nukta UI in an app

### 1. Authenticate with GitHub Packages (once per machine or CI)

Packages are private under the `Nukta-Solutions` GitHub org. Create a GitHub token with
`read:packages`, then:

```bash
# ~/.npmrc  (never commit tokens)
//npm.pkg.github.com/:_authToken=YOUR_TOKEN
```

And in the app repo:

```bash
# .npmrc
@nukta-solutions:registry=https://npm.pkg.github.com
```

### 2. Install

```bash
pnpm add @nukta-solutions/ui
pnpm add -D tailwindcss @tailwindcss/postcss @nukta-solutions/config
```

`react`, `react-dom` (19) and `tailwindcss` (4) are peer dependencies.

### 3. Global CSS

```css
/* app/globals.css */
@import "tailwindcss";
@import "@nukta-solutions/ui/styles.css";

/* Let Tailwind find the classes used inside Nukta UI components. */
@source "../node_modules/@nukta-solutions/ui/dist";
```

- The `@source` path is **relative to the CSS file**. Above, `globals.css` is in `app/`, so it goes
  up one level to `node_modules`. If your CSS lives in `src/app/globals.css`, use
  `@source "../../node_modules/@nukta-solutions/ui/dist";`.
- Import `styles.css` **after** `tailwindcss`. It replaces Tailwind's default palette with Nukta's
  semantic tokens.

### 4. Fonts and providers

```tsx
// app/layout.tsx
import "@nukta-solutions/ui/fonts.css"; // Inter + Clash Display, self-hosted
import "./globals.css";
import { Toaster, TooltipProvider } from "@nukta-solutions/ui";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
```

### 5. Use components

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle, toast } from "@nukta-solutions/ui";

<Card>
  <CardHeader>
    <CardTitle>Welcome</CardTitle>
  </CardHeader>
  <CardContent>
    <Button onClick={() => toast.success("Saved")}>Save</Button>
  </CardContent>
</Card>;
```

### 6. Lint with the design-system rule

```js
// eslint.config.js
import next from "@nukta-solutions/config/eslint/next"; // or /eslint/react, /eslint/base
export default next;
```

`nukta/no-hardcoded-design-values` warns about hardcoded colors (`#fff`, `rgb()`, `oklch()`...) and
arbitrary Tailwind values (`bg-[#123456]`, `p-[13px]`). Use tokens instead.

### Dark mode

Dark mode follows the OS (`prefers-color-scheme`) by default. To force a mode, put `dark` or `light`
on `<html>`; [`next-themes`](https://github.com/pacocoursey/next-themes) with `attribute="class"`
does this for you. The `dark:` variant works for both the class and the OS preference.

### Tokens you can use

| Kind    | Utilities                                                                                                                                                                                                                                    |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Color   | `background` `foreground` `surface` `muted` `border` `input` `ring` `primary` `secondary` `accent` `highlight` `success` `warning` `danger` `info` `overlay`, plus `*-foreground` pairs. Use them as `bg-*`, `text-*`, `border-*` and so on. |
| Radius  | `rounded-xs` … `rounded-2xl`, `rounded-full`                                                                                                                                                                                                 |
| Type    | `text-xs` … `text-5xl`, `font-sans` / `font-display` / `font-mono`, `font-normal` … `font-bold`                                                                                                                                              |
| Shadow  | `shadow-xs` … `shadow-xl`                                                                                                                                                                                                                    |
| Z-index | `z-(--z-dropdown)`, `z-(--z-modal)`, `z-(--z-toast)`, …                                                                                                                                                                                      |
| Motion  | `duration-(--duration-fast)`, `ease-standard`, `ease-emphasized`                                                                                                                                                                             |

Raw values for tooling: `import tokens from "@nukta-solutions/tokens/tokens.json"`.

---

## Developing

Requirements: Node 22+, pnpm 11 (`corepack enable`).

```bash
pnpm install
pnpm dev                     # watch-build packages + Storybook (localhost:6006) + starter (localhost:3000)
pnpm --filter @nukta-solutions/docs dev       # Storybook only
pnpm --filter @nukta-solutions/starter dev    # starter only (run `pnpm build` once first)

pnpm build        # build everything (Turborepo, cached)
pnpm test         # Vitest + Testing Library, token contrast tests, lint-rule tests
pnpm lint
pnpm typecheck
pnpm format
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org) (`feat(ui): …`,
`fix(tokens): …`). commitlint enforces this in a git hook.

### Changing tokens

Edit `packages/tokens/src/` (`palette.ts`, `semantic.ts`, `scales.ts`). `dist/theme.css` and
`dist/tokens.json` are generated from these files at build time. The contrast tests fail if a
text/background pair drops below WCAG AA.

### Adding a component

1. Create `packages/ui/src/components/<name>/` with:
   - `<name>.tsx`: build on a Radix primitive where one exists. Put variants in `cva`, merge
     classes with `cn()`, accept `className` and pass `...props` through (React 19 passes `ref` as
     a prop). Add `data-slot="<name>"`. Use **semantic token utilities only**.
   - `<name>.test.tsx`: test roles, keyboard interaction and ref forwarding with Testing Library.
   - `<name>.stories.tsx`: add a `Components/<Name>` story covering variants and states.
   - `index.ts`: export the public API.
2. Export it from `packages/ui/src/index.ts`.
3. Check the Accessibility panel in Storybook for the story, in both light and dark mode.
4. Add a changeset: `pnpm changeset`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full rules.

---

## Releasing

Releases use [Changesets](https://github.com/changesets/changesets) and publish to GitHub Packages.

1. In your PR, run `pnpm changeset`, pick packages and a bump type, and write a summary. CI fails
   if a published package changed without a changeset.
2. When the PR merges to `main`, the **Release** workflow opens or updates a
   **"chore(release): version packages"** PR. That PR bumps versions and updates the CHANGELOGs.
3. Merging that PR publishes the changed packages to GitHub Packages and creates GitHub releases.

One-time repo setup: in **Settings → Actions → General**, enable _"Allow GitHub Actions to create
and approve pull requests"_. The workflow publishes with the built-in `GITHUB_TOKEN`
(`packages: write`).

---

## Starting a new product from the template

The starter lives in `templates/starter` so it always builds against the current components. After
each release, CI exports it to a standalone template repo, **`Nukta-Solutions/nukta-starter`**,
replacing the `workspace:*` dependencies with the released versions.

**To start a product:** on GitHub, open `Nukta-Solutions/nukta-starter` → **Use this template** →
create the repo, then follow its README (`pnpm install && pnpm dev`).

**One-time setup** for the sync:

1. Create the empty repo `Nukta-Solutions/nukta-starter` and tick **Template repository** in its
   settings.
2. Create a fine-grained PAT with `contents: write` on that repo, and save it as the
   `STARTER_REPO_TOKEN` secret in this repo. Without the secret, the sync step is skipped.

**Manual export** (for example, before the first release):

```bash
node scripts/export-starter.mjs ../nukta-starter
```

---

## Fonts and licensing

- **Inter** is under the SIL Open Font License, via `@fontsource-variable/inter`.
- **Clash Display** is © Indian Type Foundry, under the ITF Free Font License
  (`packages/ui/src/fonts/ClashDisplay-LICENSE.txt`). The license allows self-hosting on Nukta's own
  sites and apps and sharing inside the company. It does **not** allow redistribution to third
  parties. Keep `@nukta-solutions/ui` private, and don't give the font files to outside contractors.
