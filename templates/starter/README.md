# Nukta Starter

A Next.js (App Router) app pre-wired with [Nukta UI](https://github.com/Nukta-Solutions/nukta-design):
layout shell, light/dark theme, toasts and example pages.

## Getting started

1. Authenticate with GitHub Packages once per machine. You need a classic token with `read:packages`:

   ```bash
   echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> ~/.npmrc
   ```

2. Install and run:

   ```bash
   pnpm install
   pnpm dev
   ```

3. Make it yours:
   - Rename the product in `lib/site.ts` and `package.json`.
   - Replace `components/logo.tsx`.
   - Delete the example pages under `app/(app)/` you don't need.

## How Nukta UI is wired

| File               | What it does                                                             |
| ------------------ | ------------------------------------------------------------------------ |
| `app/globals.css`  | Imports Tailwind, then `@nukta-solutions/ui/styles.css`, plus `@source`  |
| `app/layout.tsx`   | Imports `@nukta-solutions/ui/fonts.css`, adds Theme, Tooltip and Toaster |
| `eslint.config.js` | Uses `@nukta-solutions/config`, which flags hardcoded colors             |

Use semantic tokens only (`bg-primary`, `text-muted-foreground`, `border-border`...). Tailwind's
default palette is disabled on purpose.
