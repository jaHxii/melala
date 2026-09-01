# Melala Cafe & Restaurant

Digital menu and payment website for Melala Cafe & Restaurant in Addis Ababa, Ethiopia.

## Tech Stack

- React 19 + TanStack Router (file-based routing)
- Tailwind CSS 4 + shadcn/ui
- Vite + Nitro (Cloudflare Workers)

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

## Deployment

Builds to Cloudflare Workers via Nitro. Deploy with:

```sh
npm run build
npx nitro deploy --prebuilt
```

## Environment

- Prices in ETB (Ethiopian Birr)
- Domain: `melala.netlify.app`
