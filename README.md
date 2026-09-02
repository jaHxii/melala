# Melala Cafe & Restaurant

Digital menu and payment website for Melala Cafe & Restaurant in Addis Ababa, Ethiopia.

## Tech Stack

- React 19 + TanStack Router (file-based routing)
- Tailwind CSS 4 + custom utility classes
- Vite + Nitro (Cloudflare Workers → Netlify SSR)
- Dark mode support (system preference + manual toggle)
- Bilingual: English / Amharic

## Development

```sh
npm install
npm run dev
```

## Commands

```sh
npm run dev       # Dev server
npm run build     # Production build
npm run lint      # ESLint
npm run format    # Prettier
```

## Routes

| Route         | Description                      |
| ------------- | -------------------------------- |
| `/`           | Home page with business info     |
| `/cafe`       | Cafe menu (QR entry point)       |
| `/restaurant` | Restaurant menu (QR entry point) |
| `/payment`    | Payment QR codes                 |

## Design System

Custom Tailwind utilities defined in `src/styles.css`:

- **Buttons:** `btn-primary`, `btn-secondary`, `btn-outline`
- **Cards:** `card-hover`, `card-hover-lift`, `menu-item-card`
- **Typography:** `section-heading`, `display-title`, `tracking-widget`, `font-display`, `font-ethiopic`
- **Effects:** `bg-grain`, `glass`, `text-gradient-brand`, `animate-shimmer`
- **Accessibility:** `focus-ring`, `sr-only`

Colors use `oklch()` format (Tailwind 4 requirement). Dark mode via `.dark` class on `<html>`.

## Fonts

- **Fraunces** — display headings
- **Inter** — body text
- **Noto Sans Ethiopic** — Amharic text

## Deployment

Builds to Cloudflare Workers via Nitro. Deploy with:

```sh
npm run build
npx nitro deploy --prebuilt
```

## Environment

- Prices in ETB (Ethiopian Birr)
- Domain: `melala.netlify.app`
