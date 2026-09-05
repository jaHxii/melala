# Final audit — Melala QR menu & admin (pre-handover)

Deep line-by-line pass across every page, function, and design detail.
Food photography is intentionally excluded. Effort tags:
🟢 quick (minutes) · 🟡 medium (~an hour) · 🔴 bigger (a session / needs a decision).

---

## A. Customer-facing pages (/cafe, /restaurant)

1. 🟢 **Price formatting.** Prices render raw (`11250`), hard to read at a glance.
   Format with thousand separators: `new Intl.NumberFormat("en-ET").format(price)`
   in `MenuItemRow` (and the admin editors for consistency).
2. 🟡 **Category filter vs search.** 78 items is long; a lightweight public search
   box (filter items by EN/AM name + description) under the filter pills would
   serve repeat customers. The admin already has search — reuse the pattern.
3. 🟢 **Sticky filter is solid** (offset below toggles, counts, "All" reset). Keep.
4. 🟢 **Bundled fallback synced to the DB** — the client entered the real
   restaurant menu and `src/data/restaurantMenu.ts` now mirrors it (mock
   marker removed). If the DB menu changes again, re-sync `src/data/*.ts` so
   the pre-DB instant render never flashes stale content.
5. 🟢 **Empty section cards are hidden** (done) — confirm with the client that a
   fully-hidden section disappearing is the intended behavior (it is, per the
   admin "Hide all" workflow).
6. 🟡 **Amharic-only view.** Some customers read Amharic only; the EN name is
   still primary. Consider a locale-driven swap: when `lang=am`, show the
   Amharic name first (currently always EN-first with AM above it).
7. 🟢 **Tap-to-highlight + vibration** on item rows is good; keep.

## B. Payment page (/payment)

8. 🔴 **Hardcoded English on customer-facing text.** Still in `payment.tsx`:
   "Copy", "Copied", "Account:", "Change method", "Tap QR code to zoom",
   "Point your camera at this code" (the last two exist as `scanHint` already —
   the others need translation keys). A 100% Amharic user hits English here.
9. 🟢 **`from` search param is unvalidated** — any value besides "restaurant"
   silently becomes cafe. Fine functionally; tighten with a whitelist if ever
   linked from elsewhere.
10. 🟢 **Method list now shows account numbers + copy** (done). Consider a
    "copy all" or long-press affordance — not needed at 3 methods.
11. 🟡 **Zoom modal** is good. Add the provider app's name in the hint line
    ("Scan with the telebirr app") — the `detail` field already carries it.
12. 🟢 **execCommand copy fallback** is deprecated but harmless (only reachable
    off-HTTPS). Keep as last resort; prod is HTTPS with the Clipboard API.

## C. Home page (/)

13. 🟡 **Menu cards + "View Menu" CTA** — still the single biggest content gap
    (deferred earlier). The product is the menu; the home page should point at it.
14. 🟢 **`sameAs` missing from schema.org.** Add the Facebook/Instagram/TikTok
    URLs to the `Restaurant` structured data — free local-SEO signal.
15. 🟢 **Footer "Visit" column now shows only hours** after the plus-code removal.
    Add the street address back as text (or link it to the coordinate map URL).
16. 🟡 **og:image is the logo.** When a photo is available (outside this pass),
    use it — photo OG images convert far better on social shares.
17. 🟢 **Hero hierarchy + WhatsApp + working chevron** (done). Good.

## D. Shared shell (__root.tsx, providers)

18. 🟡 **Dark-mode logo flash.** `ThemeProvider` initializes to "light" and flips
    in an effect; the inline `<script>` paints `.dark` correctly, but
    `BrandLogo`/header choose the light logo for the first frames on dark-mode
    users. Gate logo rendering on a mounted flag to eliminate the flash.
19. 🟢 **`error-page.ts` (SSR 500 fallback)** still says "Go home" → `/` and is
    plain gray. Point it at `/cafe` ("Go to menu") to match the new 404/error
    pages; optionally reuse the theme tokens.
20. 🟢 **Unused CSP allowances:** `style-src https://fonts.googleapis.com` and
    `font-src https://fonts.gstatic.com` are dead since fonts are self-hosted —
    tighten the CSP by removing them (small hardening win).
21. 🟡 **`reportError`'s in-memory log is never surfaced** — either surface it on
    an admin debug page or drop the storage half and keep console-only.
22. 🟢 **Service worker:** cache-first for images, stale-while-revalidate for
    pages, admin bypass — solid. Bump `CACHE_NAME` whenever static content
    changes (discipline, not a fix).
23. 🟢 **Manifest:** `start_url: "/"` — for a QR-driven site consider `/cafe`;
    add a 192px icon so all install surfaces are covered.

## E. Admin panel

24. 🟢 **Everything from the admin overhaul is in** (nav tabs, undo toast, reset
    password, real errors, duplicate messages, copy item, hide-all, stats,
    collapse persistence, empty states). Only items below remain.
25. 🟡 **Password-reset email path:** Supabase must be able to send mail (free
    plan's default sender can be flaky). Test one reset end-to-end; if needed,
    configure SMTP/custom sender in Supabase Auth settings.
26. 🟡 **Recovery link lands on Supabase's page, not Melala.** Acceptable v1;
    a custom `/admin/reset` recovery route (handle the access-token hash) is a
    cleaner long-term option.
27. 🟢 **Admin is staff-tooling** — deliberately utilitarian. Keep it that way;
    don't add decorative polish.
28. 🟡 **No audit trail.** Edits aren't logged. Fine at this scale; if the client
    ever has multiple editors, a simple `admin_log` table (who/what/when) is the
    next safety step.

## F. SEO / infra / ops

29. 🟢 **Sitemap `lastmod` is hand-written** (2026-09-04) and will go stale.
    Generate it at build time (tiny script in `package.json`) or update it with
    each release.
30. 🟡 **No CI.** `netlify.toml` only sets the build command. A GitHub Actions
    workflow (lint + build on PRs) protects `main` cheaply. Optional for a
    single-developer handover.
31. 🟢 **Netlify:** secret-scan whitelist, publish dir, NODE_VERSION all correct.
    Consider protected `main` (only you merge) + instant-rollback drill before
    handover.
32. 🟡 **Custom domain decision** remains open (SITE_URL is centralized in
    `src/lib/constants.ts` — one-line change when it happens, plus QR re-verify).
33. 🟢 **Analytics** (optional, client decision): a privacy-light counter
    (Plausible/Umami) to see QR scan volume — or none at all.
34. 🟢 **Backup story** (client decision, declined earlier): a one-command
    `scripts/backup-menu.ts` export remains available if they change their mind.

## G. Suggested order after this pass

Batch 1 (fast, customer-facing): **1 price formatting · 8 payment translations ·
14 sameAs · 19 error-page link · 15 footer address · 20 CSP tighten**
Batch 2 (half-day): **2 public search · 18 logo-flash fix · 25 reset-email test**
Batch 3 (when ready): **4 fallback sync after real menu · 13 home menu cards ·
29 sitemap automation · 30 CI**