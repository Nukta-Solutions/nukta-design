# CLAUDE.md

Guidance for Claude Code sessions in this repo (Nukta UI, the Nukta Solutions design system).

## Layout

- `packages/tokens`: `@nukta-solutions/tokens`. The source of truth is `src/palette.ts` (private
  OKLCH palette from the logo), `src/semantic.ts` (semantic → palette, per light/dark) and
  `src/scales.ts`. `src/build.ts` generates `dist/theme.css` (Tailwind v4 `@theme inline` +
  CSS vars + `@custom-variant dark`) and `dist/tokens.json`. Never hand-edit `dist`.
- `packages/ui`: `@nukta-solutions/ui`. Components live in `src/components/<name>/{<name>.tsx,
<name>.test.tsx, <name>.stories.tsx, index.ts}` and are exported from `src/index.ts`. tsup
  bundles one ESM file with a `"use client"` banner. `src/styles.css` and `src/fonts.css` are
  copied to `dist`.
- `packages/config`: `@nukta-solutions/config`. Plain JS (no build): tsconfigs, ESLint flat configs
  (`eslint/base|react|next.js`), the custom rule in `eslint/plugin.js` (tests in `test/`), Prettier.
- `apps/docs`: Storybook 10 (react-vite). It loads component stories from `packages/ui/src`, and
  foundations pages from `apps/docs/stories`.
- `templates/starter`: Next.js 16 App Router starter that depends on `workspace:*`.
  `scripts/export-starter.mjs` exports it to the `Nukta-Solutions/nukta-starter` template repo.

## Non-negotiable conventions

- **Semantic tokens only** in components and apps. No hex/rgb/oklch literals, no Tailwind palette
  colors (they're disabled via `--color-*: initial`), no arbitrary values like `p-[13px]`. Fix
  `nukta/no-hardcoded-design-values` warnings rather than disabling them.
- New colors go in `packages/tokens/src/semantic.ts` for **both** modes, with a contrast pair added
  if text sits on them. `pnpm --filter @nukta-solutions/tokens test` must pass (WCAG AA).
- Every component needs a Radix primitive (when one exists), `cva` variants (exported), `cn()`
  merging, `className` and `...props` passthrough, `data-slot`, keyboard and ARIA support, **plus
  a story and a test**. React 19: `ref` is a regular prop; don't use `forwardRef`.
- Icons come from `lucide-react`, with `aria-hidden="true"` when decorative.
- Use Conventional Commits. Add a changeset (`pnpm changeset`) for any change to a published
  package.
- The npm scope is `@nukta-solutions` (it must match the GitHub org for GitHub Packages). Don't
  rename it to `@nukta`.

## Commands

```bash
pnpm install
pnpm build | test | lint | typecheck      # via Turborepo
pnpm format                                # Prettier (+ Tailwind class sorting)
pnpm --filter @nukta-solutions/ui test     # one package
pnpm --filter @nukta-solutions/docs dev    # Storybook on :6006
```

## Gotchas

- Pinned to TypeScript 6.0 (typescript-eslint doesn't support 7 yet) and ESLint 9 (react and
  jsx-a11y plugins don't support 10 yet).
- tsup's dts build needs `ignoreDeprecations: "6.0"` (it sets `baseUrl` internally).
- pnpm 11 blocks dependency build scripts; allowed ones are listed under `allowBuilds` in
  `pnpm-workspace.yaml`.
- Consumers must add `@source "<path-to>/node_modules/@nukta-solutions/ui/dist"` to their Tailwind
  CSS, or component classes won't be generated.
- jsdom shims for Radix (ResizeObserver, pointer capture, scrollIntoView, matchMedia) live in
  `packages/ui/vitest.setup.ts`.
- Clash Display (ITF Free Font License) may only be used inside Nukta. Keep `@nukta-solutions/ui`
  private.
