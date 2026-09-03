-- 0003: Payment methods — client-editable via the admin panel.
-- Safe to re-run (idempotent: create-if-not-exists + on-conflict).

-- ── updated_at trigger function (reused from 0002, idempotent) ──
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Table ──────────────────────────────────────────────────────
create table if not exists public.payment_methods (
  id              uuid primary key default gen_random_uuid(),
  name            text not null unique,
  detail          text not null default '',
  account         text not null,
  account_name_en text not null,
  account_name_am text not null default '',
  image_url       text not null,
  logo_url        text not null,
  sort_order      integer not null default 0,
  enabled         boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_payment_methods_order
  on public.payment_methods (sort_order);

alter table public.payment_methods enable row level security;

-- ── Storage bucket for uploaded QR / logo images ────────────────
insert into storage.buckets (id, name, public)
values ('payment-assets', 'payment-assets', true)
on conflict (id) do nothing;

drop policy if exists "payment-assets public read" on storage.objects;
create policy "payment-assets public read"
  on storage.objects for select
  using (bucket_id = 'payment-assets');

drop policy if exists "payment-assets auth insert" on storage.objects;
create policy "payment-assets auth insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'payment-assets');

drop policy if exists "payment-assets auth update" on storage.objects;
create policy "payment-assets auth update"
  on storage.objects for update to authenticated
  using (bucket_id = 'payment-assets');

drop policy if exists "payment-assets auth delete" on storage.objects;
create policy "payment-assets auth delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'payment-assets');

-- ── updated_at trigger ─────────────────────────────────────────
drop trigger if exists payment_methods_set_updated_at on public.payment_methods;
create trigger payment_methods_set_updated_at
  before update on public.payment_methods
  for each row execute function public.set_updated_at();

-- ── RLS policies ───────────────────────────────────────────────
drop policy if exists "Public read payment_methods" on public.payment_methods;
create policy "Public read payment_methods"
  on public.payment_methods for select
  using (true);

drop policy if exists "Admin write payment_methods" on public.payment_methods;
create policy "Admin write payment_methods"
  on public.payment_methods for all
  to authenticated
  using (true)
  with check (true);

-- ── Seed with the current methods (idempotent, never overwrites) ──
insert into public.payment_methods
  (name, detail, account, account_name_en, account_name_am, image_url, logo_url, sort_order, enabled)
values
  ('Telebirr', 'Scan with your telebirr app', '911866919', 'Girma Eticha Ayano', 'የአካውንቱ ባለቤት ስም - ግርማ ኢቲቻ አያኖ', '/qr-telebirr.jpg', '/telebirr_logo.jpg', 0, true),
  ('CBE', 'Scan with your banking app', '1000527523544', 'Girma Eticha Ayano', 'የአካውንቱ ባለቤት ስም - ግርማ ኢቲቻ አያኖ', '/qr-cbe-bir.png', '/CBE-logo.png', 1, true),
  ('Bank of Abyssinia', 'Scan with your mobile wallet', '68981212', 'Girma Eticha Ayano', 'የአካውንቱ ባለቤት ስም - ግርማ ኢቲቻ አያኖ', '/qr-abyssinia.png', '/abyssinia_logo.png', 2, true)
on conflict (name) do nothing;