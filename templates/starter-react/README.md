# Nukta Starter (React + Vite)

A single-page React app pre-wired with [Nukta UI](https://github.com/Nukta-Solutions/nukta-design):
app shell with a responsive sidebar, light/dark theme, toasts and example pages. Use it for
dashboards, admin panels and internal tools that sit behind a login and talk to an API. For
public, SEO-sensitive sites or apps that need their own server, use the Next.js starter instead.

Stack: React 19, Vite, React Router (data mode), Tailwind CSS v4, `@nukta-solutions/ui`.

## Getting started

1. Authenticate with GitHub Packages once per machine (classic token with `read:packages`):

   ```bash
   echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> ~/.npmrc
   ```

2. Install and run:

   ```bash
   pnpm install
   pnpm dev        # http://localhost:5173
   pnpm build      # type-checks, then builds static files into dist/
   pnpm preview    # serves dist/ locally
   ```

3. Make it yours:
   - Rename the product in `src/lib/site.ts`, `index.html` and `package.json`.
   - Replace `src/components/logo.tsx`.
   - Add pages in `src/pages/` and register them in `src/router.tsx`.

## Project structure

| Path                            | What it is                                                         |
| ------------------------------- | ------------------------------------------------------------------ |
| `src/main.tsx`                  | Fonts, global CSS, theme, tooltip and toast providers, the router  |
| `src/router.tsx`                | Routes. Pages other than the dashboard load lazily                 |
| `src/components/app-layout.tsx` | `AppShell`: sidebar on desktop, slide-in navigation on mobile      |
| `src/index.css`                 | Tailwind + `@nukta-solutions/ui/styles.css` + the `@source` line   |
| `src/pages/`                    | Example pages: dashboard, projects (table + dialog), settings, 404 |

## Deploying

`pnpm build` outputs static files to `dist/`. On **Cloudflare Pages**, use build command
`pnpm build` and output directory `dist`. Client-side routes such as `/projects` work out of the
box, because Pages serves `index.html` for unknown paths when no `404.html` exists.

Use semantic tokens only (`bg-primary`, `text-muted-foreground`, `border-border`...). The linter
flags hardcoded colors.
