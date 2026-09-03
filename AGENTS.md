# AGENTS.md — melala-website (Melala Cafe & Restaurant)

## Stack

- React 19, TanStack Router/Start (file-based routing), Tailwind CSS 4, Vite 8.1.5, Nitro
- TypeScript strict, ESLint + Prettier
- Deployment: Netlify (SSR via Nitro `netlify` preset)

## Commands

| Command             | Purpose                               |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Start dev server                      |
| `npm run build`     | Production build (outputs to `dist/`) |
| `npm run build:dev` | Dev-mode build                        |
| `npm run preview`   | Preview production build locally      |
| `npm run lint`      | ESLint check                          |
| `npm run format`    | Prettier write                        |

**Order:** `lint` → `build` (CI runs both). No separate typecheck script (tsc runs inside `vite build`).

## Key Config

- **vite.config.ts**: Uses `@lovable.dev/vite-tanstack-config` wrapper. Sets `resolve.tsconfigPaths: true`, Nitro preset `netlify`, server entry `server`.
- **netlify.toml**: `publish = "dist"`, `NODE_VERSION = "20"` (also in `.nvmrc`).
- **tsconfig.json**: Path alias `@/*` → `src/*`. Strict mode.
- **eslint.config.js**: Ignores `dist`, `.output`, `.vinxi`. React hooks + refresh plugins. `no-unused-vars` off.

## Routing & Entry Points

- File-based routes in `src/routes/` (`__root.tsx`, `index.tsx`, `cafe.tsx`, `restaurant.tsx`, `payment.tsx`).
- `routeTree.gen.ts` is **auto-generated** — never edit manually.
- Root layout: `src/routes/__root.tsx` (ThemeProvider, LanguageProvider, Header, Footer, HtmlLangSync).
- Server entry: `src/server.ts` (Nitro/SSR handler).

## Important Conventions

- **Colors in `src/styles.css` must use `oklch()` format** (Tailwind 4 requirement).
- `@/*` imports resolve to `src/*`.
- `package.json` has `"type": "module"` — all JS/TS is ESM.
- **`@lovable.dev/vite-tanstack-config` is a build-time dependency** — it wires TanStack Start + Nitro + Vite. Do not remove; it forces Nitro preset to `netlify` regardless of config override.
- **Dark mode:** Full support via `.dark` class on `<html>`. Theme in `localStorage("melala-theme")`. SSR-safe inline script prevents FOUC. `ThemeProvider` in `__root.tsx` provides `useTheme()` hook.
- **i18n:** All strings in `src/lib/translations.ts` (EN + AM). `useLanguage()` hook provides `t()`. `<html lang>` syncs automatically via `HtmlLangSync` component.
- **No React Query** (removed; not used).

## Fonts

- **Fraunces** (display/headings) — `--font-display` / `font-display`
- **Inter** (body text) — `--font-sans` / `font-sans`
- **Noto Sans Ethiopic** (Amharic text) — `--font-ethiopic` / `font-ethiopic`
- Registered in `@theme inline` block in `styles.css`. Always use Tailwind utility classes (`font-display`, `font-ethiopic`) not inline CSS variables.

## Design System Utilities

Custom `@utility` classes in `styles.css`:

- **Buttons:** `btn-primary`, `btn-secondary`, `btn-outline`
- **Cards:** `card-hover`, `card-hover-lift`, `menu-item-card`
- **Typography:** `section-heading`, `display-title`, `display-title-lg`, `tracking-widget`
- **Layout:** `container-main`, `glass`
- **Effects:** `bg-grain`, `bg-noise`, `rule-brand`, `text-gradient-brand`, `animate-shimmer`
- **Accessibility:** `focus-ring`, `sr-only`
- **Animations:** `animate-ken-burns`, `animate-marquee`, `animate-float`

## Build Output

- Client assets → `dist/assets/`
- SSR server function → `.netlify/functions-internal/server/`
- Netlify publishes `dist/` (static) + functions (SSR)

## Deployment

- Push to `main` triggers Netlify build (`netlify.toml`: `npm run build`, `publish = "dist"`).
- Netlify CI builds with the nitro `netlify` preset (the lovable config wrapper defaults to `cloudflare-module` locally — pass `NITRO_PRESET=netlify npm run build` to reproduce the Netlify output locally).
- `netlify.toml [build.environment]` whitelists `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` from secret scanning (public values inlined by Vite).
- **SSR uses the non-streaming renderer** (`defaultRenderHandler` in `src/server.ts`): Netlify functions truncate TanStack Start's progressive HTML stream, so pages rendered as empty `<template>` shells. `renderRouterToString` emits one complete response.
- If build fails with "Deploy directory does not exist", verify `netlify.toml` has `publish = "dist"` (not `.output/public`).

## Root Layout (`__root.tsx`)

- `ThemeProvider` → `LanguageProvider` → `HtmlLangSync` → `Header` → `main` → `Footer` → `LanguageToggle`
- `Header`: sticky, logo, nav links (active detection via `useMatches`), call button, theme toggle, language toggle, mobile menu button
- `MobileMenu`: slide-out panel (mobile only, z-index 9998), backdrop overlay
- `Footer`: business info, nav links, social links, contact
- `HtmlLangSync`: keeps `<html lang>` in sync with language context

## Payment Flow

- Cafe (`/cafe`) and Restaurant (`/restaurant`) each have "Payment" button → `/payment?from=cafe|restaurant`.
- Payment page reads `from` search param via `Route.useSearch()`.
- "Back to Menu" links to `/cafe` or `/restaurant` accordingly.

## Supabase & Admin

- `src/lib/supabase.ts` exports a client or `null` when env vars are missing — consumers guard on null (never crash SSR).
- `src/lib/menu-db.ts`: typed fetch/CRUD + `toMenuSections` mapping + swap helpers for admin reordering. Public menu pages hydrate from DB and cache the last good payload in `localStorage` via `src/lib/menu-cache.ts`.
- Admin pages are `noindex`; the site is anonymous-read/authenticated-write under RLS (see `supabase/migrations/` and `docs/SUPABASE_SETUP.md`).
- Editing is via Supabase Auth email/password at `/admin/login`. There is no app-level role system.

## QR Codes

- Payment QR images in `public/`: `qr-telebirr.jpg`, `qr-cbe-bir.png`, `qr-abyssinia.png` — referenced from `src/data/paymentMethods.ts` (the source of truth for accounts + logos).

## Git

- Identity: `cloud xii` / `cloud_xii@users.noreply.github.com`
- Remote: `https://github.com/jaHxii/melala.git` (renamed from `scan-pay`; push still works via old URL).

## Common Gotchas

- **Nitro preset**: `@lovable.dev/vite-tanstack-config` defaults to `cloudflare-module`; `vite.config.ts` `tanstackStart.nitro.preset` is ignored (it must be top-level `nitro`), so Netlify relies on its CI env selecting `netlify`. Locally, build with `NITRO_PRESET=netlify npm run build` and inspect `.netlify/functions-internal/`.
- **SSR streaming**: Netlify truncates TanStack Start's progressive stream (pages arrive as empty `<template>` shells). `src/server.ts` must keep using `defaultRenderHandler` (non-streaming) — don't switch back to `defaultStreamHandler`.
- **Bun broken on Windows** — use `npm` for all commands.
- **Service worker** in `__root.tsx` registers `sw.js` only in production.
- **`routeTree.gen.ts`** regenerates on dev server start; manual edits lost.
- **Amharic strings** in `translations.ts` — update both EN/AM together.

## File Map (High-Level)

```
src/
  routes/           # TanStack file-based routes (public + admin/)
  components/       # Shared UI + admin editors (components/admin/)
  lib/              # translations, language, constants, error-tracking,
                    # supabase, menu-db, menu-cache, admin (auth provider)
  hooks/            # useInView, useParallax
  data/             # cafeMenu, restaurantMenu, paymentMethods (fallback data)
  styles.css        # Design system (oklch colors), dark mode, animations
  server.ts         # Nitro server entry (non-streaming SSR renderer)
public/
  *.png/*.jpg/webp  # Logos, favicon, payment QR codes
  manifest.json, sw.js, offline.html, _headers, sitemap.xml, robots.txt
scripts/
  seed-menu.ts      # Idempotent DB seed (--reset, --dry-run, --type=)
supabase/
  migrations/       # Schema + RLS SQL (apply via dashboard or CLI)
docs/               # SUPABASE_SETUP.md, HANDOVER.md (owner guide + QA)
netlify.toml        # Build + deploy config (+ secret-scan whitelist)
vite.config.ts      # TanStack Start + Nitro config (via lovable wrapper)
tsconfig.json       # TS config + path aliases
```

## Verify Before Commit

```bash
npm run lint && npm run build
```
