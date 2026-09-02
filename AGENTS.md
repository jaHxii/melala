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

- Push to `main` triggers Netlify build.
- Build command: `npm run build`
- Node 20 required (`.nvmrc` + `netlify.toml`).
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

## QR Codes

- Real images in `public/`: `qr-telebirr.png`, `qr-cbe-bir.png`, `qr-coopay.png` (used on payment page).
- Generated marketing QR codes in repo root: `qr-cafe.png`, `qr-restaurant.png` (1024×1024, error correction H).

## Git

- Identity: `cloud xii` / `cloud_xii@users.noreply.github.com`
- Remote: `https://github.com/jaHxii/melala.git` (renamed from `scan-pay`; push still works via old URL).

## Common Gotchas

- **Nitro preset**: `@lovable.dev/vite-tanstack-config` hardcodes `cloudflare-module` internally; `vite.config.ts` override to `netlify` works but the wrapper may ignore it. If SSR breaks on Netlify, check build log for `[nitro] Building (preset: netlify)`.
- **Bun broken on Windows** — use `npm` for all commands.
- **Service worker** in `__root.tsx` registers `sw.js` only in production.
- **`routeTree.gen.ts`** regenerates on dev server start; manual edits lost.
- **Amharic strings** in `translations.ts` — update both EN/AM together.
- **`qrcode`** is in devDependencies but not imported anywhere — may be unused.

## File Map (High-Level)

```
src/
  routes/           # TanStack file-based routes
  components/       # Shared UI (menu.tsx, LanguageToggle.tsx)
  lib/              # translations, language context, constants, error-tracking
  hooks/            # useInView, useParallax
  data/             # cafeMenu, restaurantMenu, paymentMethods
  styles.css        # Design system (oklch colors), dark mode, animations, print styles, bg pattern
  server.ts         # Nitro server entry
public/
  *.png             # Logo, favicon, payment QR codes
  manifest.json, sw.js, offline.html, _headers, sitemap.xml, robots.txt
netlify.toml        # Build + deploy config
vite.config.ts      # TanStack Start + Nitro config (via lovable wrapper)
tsconfig.json       # TS config + path aliases
```

## Verify Before Commit

```bash
npm run lint && npm run build
```
