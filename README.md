# Melala Cafe & Restaurant

Digital menu and payment website for Melala Cafe & Restaurant in Addis Ababa, Ethiopia.
Customers scan a table QR code → menu page (`/cafe` or `/restaurant`) → pay by scanning
Telebirr / CBE / Bank of Abyssinia QR codes on `/payment`.

Live site: **https://melala.netlify.app**

## Tech Stack

- React 19 + TanStack Router/Start (file-based routing, SSR)
- Tailwind CSS 4 + custom utility classes in `src/styles.css`
- Vite 8 + Nitro (Netlify SSR via the `netlify` nitro preset)
- Supabase (Postgres): `sections` + `menu_items` tables, RLS, email/password auth for admin
- Dark mode + bilingual English/Amharic
- PWA: service worker (`public/sw.js`), manifest, offline page

## Routes

| Route               | Description                          |
| ------------------- | ------------------------------------ |
| `/`                 | Home page with business info         |
| `/cafe`             | Cafe menu (QR entry point)           |
| `/restaurant`       | Restaurant menu (QR entry point)     |
| `/payment`          | Payment QR codes                     |
| `/admin/login`      | Admin sign-in (Supabase auth)        |
| `/admin`            | Admin dashboard                      |
| `/admin/cafe`       | Edit the cafe menu                   |
| `/admin/restaurant` | Edit the restaurant menu             |

Menu pages read from Supabase and fall back to the last good cached menu
(localStorage) or the bundled data files (`src/data/*.ts`) when the DB is
unreachable. Admin routes are `noindex`.

## Environment

Copy `.env.example` to `.env`:

| Variable                          | Public? | Purpose                                    |
| --------------------------------- | ------- | ------------------------------------------ |
| `VITE_SUPABASE_URL`               | yes     | Supabase project URL                       |
| `VITE_SUPABASE_ANON_KEY`          | yes     | Publishable key (RLS blocks writes)        |
| `VITE_SUPABASE_SERVICE_ROLE_KEY`  | no      | Local seed/migration scripts only          |

On Netlify, set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` as build
environment variables (they do **not** need to be marked as secrets).

## Development

```sh
npm install
npm run dev
```

Other commands: `npm run build`, `npm run lint`, `npm run format`, `npm run preview`.

## Database setup

Schema + RLS live in `supabase/migrations/` — apply them in the Supabase SQL
editor (or `supabase db push`). Full steps: **docs/SUPABASE_SETUP.md**.

Seed the DB from the bundled menu data (idempotent):

```sh
npx tsx scripts/seed-menu.ts            # upsert
npx tsx scripts/seed-menu.ts --dry-run  # preview
npx tsx scripts/seed-menu.ts --reset    # wipe + reseed
```

## Deployment

Pushing to `main` triggers a Netlify build (`netlify.toml`: `npm run build`,
publish `dist`). Netlify CI builds with the `netlify` nitro preset and
publishes the SSR function. `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are
whitelisted from Netlify secret scanning because they are public values that
Vite inlines into the bundle.

SSR intentionally uses the non-streaming renderer (`defaultRenderHandler` in
`src/server.ts`): Netlify functions truncate TanStack Start's progressive HTML
stream, so pages are rendered as one complete response instead.

## Design & conventions

See **AGENTS.md** for conventions (oklch colors, i18n keys, generated
`routeTree.gen.ts`, `@/*` alias, etc.).

## Handover

Owner guide, runbooks, and the pre-launch QA checklist: **docs/HANDOVER.md**.
