-- ── 0002: updated_at trigger + Row Level Security ─────────────
-- Model: the public site reads with the ANON key; only authenticated
-- (admin) users may write. This makes the publishable key safe to embed.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sections_set_updated_at on public.sections;
create trigger sections_set_updated_at
  before update on public.sections
  for each row execute function public.set_updated_at();

drop trigger if exists menu_items_set_updated_at on public.menu_items;
create trigger menu_items_set_updated_at
  before update on public.menu_items
  for each row execute function public.set_updated_at();

-- Public read (anon key)
drop policy if exists "Public read sections" on public.sections;
create policy "Public read sections"
  on public.sections for select
  using (true);

drop policy if exists "Public read menu_items" on public.menu_items;
create policy "Public read menu_items"
  on public.menu_items for select
  using (true);

-- Authenticated admin write
drop policy if exists "Admin write sections" on public.sections;
create policy "Admin write sections"
  on public.sections for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin write menu_items" on public.menu_items;
create policy "Admin write menu_items"
  on public.menu_items for all
  to authenticated
  using (true)
  with check (true);
