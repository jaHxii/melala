# Handover & owner guide — Melala Cafe & Restaurant

This document is for the site owner/operator (and the developer handing it
over). It covers what exists, day-to-day operations, and the pre-launch QA
checklist that must pass before calling the project finished.

## What you have

- **Public site** (`https://melala.netlify.app`)
  - `/` business page · `/cafe` & `/restaurant` menus · `/payment` QR codes
  - Dark/light theme + English/Amharic toggle
- **Admin** at `/admin` (sign in at `/admin/login` with your Supabase user):
  - Edit, hide/show, add, delete, and **reorder** sections and items
  - Deleting a section warns you and removes all its items
- **Menu data** lives in Supabase. When the database is unreachable, menu
  pages show the last saved menu (flagged with a notice) rather than breaking.
- **Payment methods** are managed from the admin (`/admin/payments`): names,
  account numbers, owner names, QR + logo images, show/hide, and order. The
  `/payment` page shows the saved methods (with a last-saved fallback if the
  database is unreachable).

## Day-to-day

### Change a price / item
1. Open `https://melala.netlify.app/admin` → sign in.
2. Pick Cafe or Restaurant menu → find the section → **Edit**.
3. Save. Refresh the public page to confirm. (PWA users may need to pull to
   refresh or close/reopen the page to see changes.)

### Reorder a menu
Use the ↑/↓ arrows next to a section header or an item row.

### Hide something temporarily (e.g. "soup of the day" sold out)
Uncheck **Available on menu** while editing the item — it disappears from the
public menu but stays saved.

### Add a section or item
Use the dashed **+ Add Section** / **+ Add Item** buttons at the bottom of the
admin pages. New entries appear at the end of the list — reorder with the
arrows.

### Manage payment methods
Open **Admin → Payment Methods**. You can:
- **Edit** a method's name, description, account number, or owner name.
- **Replace the QR or logo image** — upload the official image saved from the
  bank/app. Never generate a QR yourself; upload the real code so it always
  matches the account.
- **Hide / show** a method with the toggle (hidden methods disappear from
  `/payment` but stay saved).
- **Reorder** methods with the ↑/↓ arrows — the first one is the default
  when the customer opens `/payment`.
- **Delete** a method (with confirmation).

Changes appear on `/payment` immediately after a refresh.

## Critical checks before launch (must all pass)

1. **Payment scan test (do this in person, with a real phone):**
   - Open `/payment?from=cafe` on a phone.
   - Scan the **Telebirr**, **CBE**, and **Bank of Abyssinia** codes with
     their respective apps and confirm each routes to the right account.
   - Test the "copy account number" button on each method.
2. **Content sign-off:** every item, price (ETB), description, and Amharic
   name is correct *for the client*. The bundled fallback data in
   `src/data/restaurantMenu.ts` still carries a "mock content" comment until
   the real restaurant menu is confirmed — remove that comment only after
   sign-off.
3. **Device QA matrix** (Android + iPhone, and both are covered):

   | Test                                   | Android | iPhone |
   | -------------------------------------- | ------- | ------ |
   | Scan printed QR → correct menu page    | ☐       | ☐      |
   | Cafe + restaurant menu render, images OK | ☐     | ☐      |
   | Light + dark theme                     | ☐       | ☐      |
   | English ↔ Amharic toggle               | ☐       | ☐      |
   | Payment page: each QR loads, scan works| ☐       | ☐      |
   | Copy-account button                    | ☐       | ☐      |
   | Airplane mode: saved menu still shows with notice | ☐ | ☐ |
   | Slow network (3G throttle): pages load | ☐       | ☐      |

4. **Admin check:** sign in as the owner from a second device and make a
   test edit (change a price back after).
5. **Domain decision:** the site is on the free `melala.netlify.app`
   subdomain. If the client wants their own domain, buy it, add it in Netlify
   (Domain management), and update `SITE_URL` in `src/lib/constants.ts` +
   `public/sitemap.xml`, then redeploy. Re-print QRs afterwards is **not**
   needed (QRs point at paths, not the host) — actually verify by scanning.

## Admin credentials & access

The admin login (`/admin/login`) is a Supabase Auth email/password account.
The app never rotates or expires passwords, so one saved account works
indefinitely — handing over the existing account as-is is fine.

- **Store the credentials in a password manager** (1Password, Bitwarden,
  Google Password Manager) or a written note kept by the owner. Never put
  them in the repo, this doc, or any file that ships with the site.
- **Forgot the password?** Supabase → Authentication → Users → the user →
  **Reset password** (or send a new invite). The menu data is untouched —
  only the password changes.
- **Optional:** create a second user (Authentication → Users → Invite) if the
  client team should have its own login separate from the developer's.
  Not required.

## Runbooks

### Redeploy / rollback
- New push to `main` → Netlify builds automatically.
- Rollback: Netlify → Deploys → pick the last good deploy → **Publish deploy**.

### Fix a broken menu (data-level)
1. If items are wrong/missing: run the seed script to reconcile with the
   bundled data (`npx tsx scripts/seed-menu.ts --dry-run` first).
2. If the database itself is broken: restore from backup (see
   `docs/SUPABASE_SETUP.md`).

### Admin password reset
Supabase dashboard → Authentication → Users → the user → *Send password
reset*.

## Known limitations (accepted for v1)

- Menu changes are cached: the service worker and the menu cache mean a
  customer may see an up-to-~1-minute-old menu; pull-to-refresh fixes it.
- No photos on menu items yet (text-only rows).
- No online ordering — the site ends at payment instructions.
- No per-table tracking (each QR goes to the same page).

## Developer handover

Source: GitHub `jaHxii/melala` (branch `main`) · Deploy: Netlify
(`melala.netlify.app`) · DB: Supabase. Read `README.md` + `AGENTS.md` first.
