# Project Knowledge — Melala Cafe & Restaurant

## Overview

Digital menu and payment website for Melala Cafe & Restaurant in Addis Ababa, Ethiopia. Users scan QR codes to view cafe or restaurant menus and pay via Telebirr, CBE Birr, or Coopay.

## Tech Stack

- **React 19** + **TanStack Router/Start** (file-based routing)
- **Tailwind CSS 4** + custom utility classes
- **Vite 8.1** + **Nitro** (SSR via Netlify preset)
- **TypeScript 5.8** (strict mode)
- **Node 20** (`.nvmrc`)

## Commands

```sh
npm install          # Install deps (use npm, not bun on Windows)
npm run dev          # Start dev server
npm run build        # Production build (outputs to dist/)
npm run build:dev    # Dev-mode build
npm run preview      # Preview production build locally
npm run lint         # ESLint check
npm run format       # Prettier write
```

**Verify before commit:** `npm run lint && npm run build`
No separate typecheck script — tsc runs inside `vite build`.

## Project Structure

```
src/
  routes/           # File-based routes (__root, index, cafe, restaurant, payment)
  components/       # Shared UI (menu.tsx, LanguageToggle.tsx)
  lib/              # translations.ts (EN/AM), language.tsx (context), constants.ts, error-tracking.ts
  hooks/            # useInView, useParallax
  data/             # cafeMenu.ts, restaurantMenu.ts, paymentMethods.ts
  styles.css        # Design system (oklch colors), animations, dark mode, print styles
  router.tsx        # TanStack Router setup
  routeTree.gen.ts  # AUTO-GENERATED — never edit manually
  server.ts         # Nitro server entry
public/
  *.png             # Logo, favicon, payment QR images
  manifest.json, sw.js, offline.html, _headers, sitemap.xml, robots.txt
netlify.toml        # Deploy config (publish = "dist", NODE_VERSION = "20")
vite.config.ts      # Uses @lovable.dev/vite-tanstack-config wrapper
tsconfig.json       # Path alias @/* → src/*, strict mode
```

## Key Conventions

- **Colors use `oklch()` format** in `src/styles.css` (Tailwind 4 requirement).
- **ESM only** — `"type": "module"` in package.json.
- **Path alias:** `@/*` resolves to `src/*`.
- **Dark mode:** Full dark mode support via `.dark` class on `<html>`. Theme stored in `localStorage("melala-theme")`. SSR-safe inline script prevents FOUC.
- **i18n:** All user-visible strings in `src/lib/translations.ts` (EN + AM). Update both languages together. Use `t()` from `useLanguage()` context hook. `<html lang>` syncs automatically.
- **Fonts:** Fraunces (display), Inter (body), Noto Sans Ethiopic (Amharic). Registered via `--font-display`, `--font-sans`, `--font-ethiopic` in `@theme inline`.

## Design System Utilities

Custom `@utility` classes in `styles.css`:

- **Buttons:** `btn-primary`, `btn-secondary`, `btn-outline`
- **Cards:** `card-hover`, `card-hover-lift`, `menu-item-card`
- **Typography:** `section-heading`, `display-title`, `display-title-lg`, `tracking-widget`, `tracking-tight-ethiopic`
- **Layout:** `container-main`, `glass`
- **Effects:** `bg-grain`, `bg-noise`, `rule-brand`, `text-gradient-brand`, `animate-shimmer`
- **Accessibility:** `focus-ring`, `sr-only`
- **Animations:** `animate-ken-burns`, `animate-marquee`, `animate-float`

## Routes

| Route         | Description                                   |
| ------------- | --------------------------------------------- |
| `/`           | Home page with business info, structured data |
| `/cafe`       | Cafe menu (QR entry point)                    |
| `/restaurant` | Restaurant menu (QR entry point)              |
| `/payment`    | Payment QR codes; reads `?from=cafe           | restaurant` search param |

## Root Layout (`__root.tsx`)

- `ThemeProvider` wraps everything (dark mode context)
- `LanguageProvider` wraps everything (i18n context)
- `Header` with nav, logo, call button, theme toggle, language toggle, mobile menu
- `Footer` with business info, social links, nav links
- `HtmlLangSync` component keeps `<html lang>` in sync with language context
- `MobileMenu` slide-out panel (mobile only, z-index 9998)

## Deployment

- Push to `main` triggers Netlify build.
- Build: `npm run build` → `dist/` (static) + `.netlify/functions-internal/server/` (SSR).
- Deploy command: `npx nitro deploy --prebuilt`

## Gotchas

- `@lovable.dev/vite-tanstack-config` wraps Vite config and forces Nitro preset internally. The `netlify` override in `vite.config.ts` works but may be silently ignored — verify build log says `[nitro] Building (preset: netlify)`.
- `routeTree.gen.ts` regenerates on dev server start. Never edit manually.
- Service worker (`sw.js`) registers only in production.
- Bun is broken on Windows — always use npm.
- If build fails with "Deploy directory does not exist", check `netlify.toml` has `publish = "dist"`.
- `qrcode` is in devDependencies but not imported anywhere — may be unused or for future use.

## Pricing

All prices in **ETB** (Ethiopian Birr).
