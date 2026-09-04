# Client Meeting Prep — Melala Cafe & Restaurant

**Purpose of this document:** everything you need to know before the client
meeting. It covers (1) one-page state of the product, (2) what to demo live,
(3) every decision the client must make, each with options + recommendation +
cost, (4) pricing scenarios (hosting × domain × database), (5) security
explanation, (6) honest known limitations, and (7) the launch QA checklist.

Last updated: 2026-09-04 · Repo: `github.com/jaHxii/melala` (branch `main`,
fully pushed & deployed) · Live: `melala.netlify.app`

---

## 1. One-page state of the product

**What the client gets (already built, live, and tested):**

| Surface | What it is | Status |
|---|---|---|
| `/cafe` | Cafe menu — 78 items, bilingual EN/AM, search, dark/light theme | ✅ Live, client verified counts |
| `/restaurant` | Restaurant menu — 40 items, same experience | ✅ Live, client verified counts |
| `/payment` | Payment page — Telebirr, CBE, Bank of Abyssinia: real QRs, account copy button, zoom, bilingual | ✅ Live, client scanned all 3 QRs — work |
| `/admin` | Admin panel: edit/add/delete/hide/reorder menus, manage payment methods, stats, undo, password reset | ✅ Live |
| `/` | Business page (brand/SEO face — customers arrive by QR and never see it) | ✅ Live |

**Flow the client asked for — delivered exactly:** two separate menus under one
domain, reached only through QR codes, no visible home page, no back button
(`BackBlocker` locks it on menu pages), payment instructions end the journey.

**Stack (one line each, no need to memorize):**
- React 19 + TanStack Router/Start + Vite 8 + Nitro (SSR on Netlify)
- Supabase (Postgres) — menus + payment methods + auth, protected by RLS
- Tailwind 4 — dark/light theme, English/Amharic, Ethiopic typeface
- Hosted on Netlify (free plan today) — auto-builds on push to GitHub

**What the client manages themselves (no developer needed):**
- Menu content: sections, items, prices (ETB), EN + AM names, descriptions
- Show/hide items (e.g. "sold out today"), reorder sections & items
- Payment methods: names, account numbers, owner names, QR + logo images,
  show/hide, order — **everything editable from the admin panel**

---

## 2. Demo script for the meeting (~10 minutes)

Do this with the client's phone, live:

1. **Scan the cafe QR** → `/cafe` opens. Show: category filter, search,
   formatted prices (`1,250`), EN→AM toggle, dark/light toggle, item rows.
2. **Tap "Pay your bill"** → `/payment`. Show the 3 methods. Tap Telebirr →
   real QR → **scan it with the Telebirr app** and confirm the account name.
   Repeat the copy-account button.
3. **Back button on the menu** — press it; nothing happens (locked, by design).
4. **Scan the restaurant QR** → `/restaurant` opens — a clearly different menu.
5. **Admin:** open `/admin` on the client's phone, sign in, and let *them*
   change a price (then change it back) and open the payment-methods editor —
   the part they'll touch daily. Point out: tabs, search, undo after delete,
   "Open live page" link, dashboard stats.
6. **Airplane-mode test** (if time): menu still renders with the saved copy.

That demo proves every promise: two menus, QR-only, editable everything.

---

## 3. Decisions the client must make

Each section = decision → options → recommendation → cost. Put these on the
table one by one.

---

### Decision A — Hosting & domain (the biggest visible one)

**Two separate questions:** *where the site is hosted* (already Netlify) and
*what address the customer sees* (today `melala.netlify.app`).

**A1. Keep the free Netlify subdomain — $0/year**

| Item | Detail |
|---|---|
| Address | `melala.netlify.app` |
| Cost | $0 forever (free plan) |
| Bandwidth | ~100 GB/month (free plan) — a menu site uses a few GB/month |
| Builds | ~300 build minutes/month — far beyond what we use |
| SSL | Included, automatic |
| Risk | The address says "netlify.app", not the business name. No risk to function. |

The free plan is genuinely enough for a QR-menu site. The only downsides are
cosmetic (the URL) and ownership (Netlify account holds it).

**A2. Add a custom domain — ~$10–14/year (the domain only; Netlify does not charge for it)**

The Netlify **free plan supports custom domains with SSL at no extra cost** —
you only pay for the domain registration itself.

| Option | Cost/year | Notes |
|---|---|---|
| `.com` (e.g. `melalacoffee.com`) | ~$10–14 | Best value, most trust; from Cloudflare/Namecheap/GoDaddy |
| `.et` (e.g. `melala.et`) | higher (local registry) | Local credibility, more expensive, renewals can be manual |
| `.co` / `.cafe` / other | ~$10–30 | `.cafe` is a nice niche fit if available |

**What happens when the domain is bought** (developer does this, ~30 min):
1. Buy the domain (client pays, keeps the registrar account).
2. Netlify → Domain management → add custom domain → verify → SSL auto-issues.
3. Update `SITE_URL` + sitemap + redeploy (one code change).
4. **QR codes:** the printed QRs today encode `melala.netlify.app/cafe` etc.
   Both addresses will work after the domain is added, so **existing QRs keep
   working**. If the client wants the QRs to show the *new* domain, we re-print
   them (new QR assets + admin doesn't change).

**Recommendation:** buy a `.com` (or `.et` if local credibility matters most)
— it's the single cheapest thing that makes the product feel owned. But the
free subdomain is a completely valid launch option; the site works identically.

### Decision B — Database

The database is **Supabase** (a managed Postgres). Your data is the menus +
payment methods + admin accounts.

**B1. Supabase Free — $0/month** — *recommended for launch*

| Limit | Free tier | What Melala uses |
|---|---|---|
| Database | 500 MB | ~1–2 MB (text menus + a few images) |
| Monthly active users | 50,000 | Customers scan QRs; each visit counts once — fine |
| Bandwidth (egress) | 5 GB/month | Tiny — JSON menus are KBs |
| Projects | 1 | We have 1 |
| Auto-pause | Pauses after 1 week of no activity, wakes on request | A working cafe sees daily scans → never pauses. Inactive periods: a visitor just re-triggers it (adds ~1s). |
| Backups | Manual weekly export or paid PITR | Owner schedules a weekly export (steps in `SUPABASE_SETUP.md`) |
| Reset-password emails | Uses Supabase's shared mailer — emails can be slow or land in spam | This is the **one real friction point** on free |

**Free is genuinely right for this product.** The menu dataset is tiny;
a busy cafe will not approach any limit.

**B2. Supabase Pro — $25/month** — *only if a specific need appears*

| What you get for $25/mo |
|---|
| 100K monthly active users, 8 GB database, 250 GB bandwidth |
| Daily backups with 7-day retention (no manual exports) |
| No auto-pause |
| Custom email sender (reliable admin password-reset emails) |

**Recommendation:** start Free ($0). The only reason to go Pro early is if the
client wants iron-clad backup automation or bulletproof reset emails from day
one. Everything else (reliable resets) has a manual workaround: the owner (or
you) can reset a password from the Supabase dashboard in 30 seconds.

**Do NOT switch databases** — it's the integrated storage + auth for the whole
product; there is no cheaper/better alternative for this workload.

### Decision C — Payment methods (client-editable — already built)

The client can fully manage the payment part themselves:
names, account numbers, owner names, **QR images**, logos, show/hide, order.

- ✅ Already live — demo it in the meeting (Section 2, step 5).
- The client said they'll enter real data via the admin (the three methods are
  currently seeded with the real QRs they tested).
- **One rule to give the client:** always upload the *official* QR image saved
  from the bank/app — never generate a QR — so it always matches the account.

### Decision D — Menu content sign-off (text only, no photos — per client)

- Cafe menu: client verified 78 items.
- Restaurant menu: 40 items exist; the bundled fallback data still carries a
  "mock content" marker until the client enters/confirms the real restaurant
  menu (they planned to input real data via admin).
- **Meeting ask:** get explicit sign-off that cafe items/prices/Amharic names
  are final, and a date for the restaurant menu entry.
- Food photos were explicitly excluded — note that as a *future* upgrade
  (photos sell food; would be a small addition later, not a blocker).

### Decision E — Contact & socials (small, for the live pages)

- WhatsApp `wa.me/251911609157` is already wired on the home page — confirm the
  number is correct, or give the new one.
- Facebook / Instagram / TikTok handles — currently referenced in the footer.
  Providing them lets us link them (and improves local search).
- Street address — the plus-code was removed from the footer per instructions;
  decide if a plain street address should be shown (it's currently map-link only).

### Decision F — Footer credit

- A tiny "Developed by cloud_xii" line sits at the bottom of every page.
- **Ask:** keep it (unobtrusive, free advertising) or remove it. One-line change.

### Decision G — Analytics (optional, client choice)

- No tracking today (privacy-light by design).
- Option: a simple, cookieless visitor counter (Umami/Plausible, ~free) to see
  how often QRs get scanned per week — helps judge if the menus are being used.
- **Ask:** want it now, later, or never? Not required.

### Decision H — Ownership & access (do this at/near the meeting)

- **Netlify account:** currently under the developer. For true ownership,
  transfer to the client's account (free) or at minimum share access. Same for
  the GitHub repo (`jaHxii/melala`). Decide who "owns" the keys.
- **Supabase account:** same question — the database + admin logins live there.
- **Credentials:** the admin login (`/admin/login`) is a Supabase email/password
  account — store it in the client's password manager at the meeting. Never in
  the repo or in printed docs lying around.
- **Backups:** even on Free, schedule a weekly export (5 min, one-time setup,
  steps in `SUPABASE_SETUP.md`). A backup outside Supabase means the menus can
  never be lost even if the project is deleted.

### Decision I — Support & maintenance expectations

Set expectations explicitly so there are no surprises:

| Who does what | Details |
|---|---|
| **Client (daily)** | Edit menus, prices, hide items, manage payment methods — all in `/admin`, no code |
| **Client (occasional)** | Weekly backup export; re-scan printed QRs quarterly (wear/ripping); keep account credentials safe |
| **Developer (on request)** | Code changes (new features, photos later, domain setup, analytics, any bug) — billed separately, not a subscription |
| **What breaks?** | Nothing should without intervention: if Netlify is down the site is down; if Supabase is down menus fall back to a saved copy with a notice. No maintenance runs needed. |

---

## 4. Pricing scenarios (all-in, annual)

| Scenario | Domain | Hosting | Database | **Year 1 total** |
|---|---|---|---|---|
| **A. Launch free (recommended)** | `melala.netlify.app` | Free | Supabase Free | **$0** |
| **B. Own domain, free tier** | `.com` ~$12 | Free (Netlify) | Supabase Free | **~$12** |
| **C. Own domain + Pro DB** | `.com` ~$12 | Free | Supabase Pro $25/mo | **~$312** |
| **D. Everything Pro** | `.com` ~$12 | (Netlify free suffices; Personal $9/mo ≈ $108 if ever needed) | Supabase Pro $25/mo | **~$420** |

**Honest recommendation for this client: Scenario B (~$12/year).**
A .com domain for ~$1/month, everything else free. Scenario A ($0) is also a
perfectly defensible launch if the client doesn't care about the URL.

Renewal note: domain ~$12/yr; Supabase Pro $25/mo only if ever chosen.

---

## 5. Security — what to say if the client asks

- The visible Supabase key in the site is the **public "anon" key** — it is
  *supposed* to be public (like a JavaScript API key).
- The real protection is **Row-Level Security (RLS)** in the database: anyone
  can *read* menus (that's the point), but **only logged-in admins can
  write**. We verified this (anon insert attempts are rejected).
- Admin login is Supabase Auth (email/password). There's no separate role
  system — anyone with a valid login can edit. Only invite people who should
  change prices.
- The private **service-role key** exists only on the developer's machine /
  seed script — it is **not** deployed to Netlify.
- Password reset exists on the login page; on the free plan the email may be
  slow/spam — the owner can always reset from the Supabase dashboard.

---

## 6. Known limitations (say these before the client discovers them)

1. **~1-minute menu cache:** after an admin edit, a customer's open page may
   show old data for up to a minute; pull-to-refresh fixes it. (Not an issue
   for printed-QR flow.)
2. **No online ordering/payment capture** — the site shows payment instructions
   and links to scan; it does not confirm money received. Banks don't give a
   free API for that; it's the standard approach for Ethiopian QR menus.
3. **No food photos** (client's choice) — text-only rows; photos are the #1
   future upgrade.
4. **No per-table separation** — every cafe QR leads to the same cafe menu, every
   restaurant QR to the same restaurant menu. If the client later wants
   table-specific service (e.g. table number entry or per-table QR → order),
   that's a new feature, not part of v1.
5. **PWA niceties exist** (works offline, installable) but customers will mostly
   scan-and-leave.
6. **404/error pages** route stray visitors to the cafe menu — no dead ends.

---

## 7. Launch QA checklist (finish before "it's done" is said)

- [ ] Scan the **printed cafe** QR → correct page on the client's phone
- [ ] Scan the **printed restaurant** QR → correct page
- [ ] Scan all **3 payment QRs** with their real apps (done — client verified; re-verify once after final printed set)
- [ ] Copy-account button on each payment method (done)
- [ ] Client signs off cafe menu content (items/prices/Amharic)
- [ ] Restaurant real menu entered (client) — remove mock flag after
- [ ] `/admin/payments` shows the 3 methods (confirms migration `0003` applied; if empty, run the `0003` SQL in Supabase once)
- [ ] Admin login works on a **second device** (phone)
- [ ] Test password reset end-to-end OR document the dashboard-reset fallback
- [ ] Backup export scheduled (weekly) — steps in `SUPABASE_SETUP.md`
- [ ] Credentials saved in the client's password manager
- [ ] Domain decision made (A1/A2) and, if bought, custom domain connected
- [ ] QR re-print order placed (if custom domain chosen)

---

## 8. Quick-reference "ask list" — one page to read aloud

1. **Domain:** keep `melala.netlify.app` (free) or buy `.com`/`.et` (~$12/yr)? → **Recommend: buy the domain**
2. **Database:** stay on Supabase Free ($0) — only go Pro ($25/mo) if you want automated backups/reset emails hardened → **Recommend: Free**
3. **Restaurant menu:** you enter the real 40 items via admin — when?
4. **Content sign-off:** cafe menu final?
5. **WhatsApp number correct?** (currently 251 911 609 157)
6. **Social links** to add to the footer?
7. **Street address** to show on home/footer?
8. **Footer credit** "Developed by cloud_xii" — keep or remove?
9. **Analytics** (scan counter) — now, later, never?
10. **Ownership:** transfer Netlify/Supabase/GitHub to the client's accounts?
11. **Backup:** schedule the weekly export together today?
12. **Photos:** no food photos for launch — revisit as v2?

**If they ask "what's the total cost?"** → Scenario B: the domain (~$12/year).
Everything else is $0. That's the whole recurring cost.