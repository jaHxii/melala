# Supabase setup

Everything the site needs from Supabase: tables, RLS, auth, and backups.

## 1. Create the project

1. In Supabase create a new project (or reuse the existing one for Melala).
2. Note the **Project URL** and the **anon public key** under
   *Project Settings → API*.

## 2. Apply the schema

Open **SQL Editor** and run the files in order (each is safe to re-run):

1. `supabase/migrations/0001_create_tables.sql`
2. `supabase/migrations/0002_updated_at_and_rls.sql`
3. `supabase/migrations/0003_payment_methods.sql`

If the tables already existed before these files were written, `0002` still
enables RLS + policies for them — run it even if `0001` reports "already
exists". `0003` creates the `payment_methods` table (client-editable from the
admin panel), the public `payment-assets` storage bucket for uploaded QR/logo
images, and seeds the three current methods (insert-only, never overwrites).

## 3. Verify RLS

The whole security model relies on RLS, so verify it once:

```sql
-- 1) anon can read:
set role anon;
select count(*) from public.sections;      -- should work
-- 2) anon CANNOT write (this must fail):
insert into public.sections (name_en, type) values ('x', 'cafe');
reset role;
```

Expected: read succeeds, insert throws an RLS error. If the insert succeeds,
the policies in `0002` were not applied.

## 4. Create the admin user

In the Supabase dashboard: **Authentication → Users → Invite user**.

- Use the owner's email + a strong password, or let the invite email set it.
- The admin signs in at `https://melala.netlify.app/admin/login` with that
  email/password.
- Password reset: *Authentication → Users → … → Send password reset*.

There is no app-level role system: any authenticated user can edit menus.
Only invite people who should be able to change prices.

## 5. Configure the app

Copy to `.env` locally and to **Netlify → Site configuration → Environment
variables** (build scope):

| Variable                 | Marked secret? |
| ------------------------ | -------------- |
| `VITE_SUPABASE_URL`      | No (public)    |
| `VITE_SUPABASE_ANON_KEY` | No (public)    |

Do **not** add the service-role key to Netlify — it is only used locally by
`scripts/seed-menu.ts`.

## 6. Seed the menu

```sh
npx tsx scripts/seed-menu.ts --dry-run   # preview
npx tsx scripts/seed-menu.ts             # apply (needs service-role key in .env)
```

## 7. Backups

- Free tier: enable **Database → Backups → PITR** (paid) or schedule a weekly
  export from the dashboard.
- Store one exported copy off-Supabase (e.g. a private GitHub repo or Google
  Drive) so the schema + data survive project deletion.
- Test a restore once before handover.

## Troubleshooting

| Symptom                                  | Cause / fix                                        |
| ---------------------------------------- | -------------------------------------------------- |
| Public menu shows bundled data, no banner| DB reachable but unseeded → run the seed script    |
| "Showing saved menu" banner on menu pages| Supabase unreachable from the browser/Netlify      |
| Admin "Database unreachable" on dashboard| Same — check env vars + RLS                        |
| Admin login error                        | User not invited, or project URL/key mismatch      |
| Admin "Failed to reorder/delete" errors  | RLS write policies missing — run `0002` (admin write policies) |
