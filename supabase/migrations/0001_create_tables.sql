-- ── 0001: Core menu tables ─────────────────────────────────────
-- Safe to run repeatedly (IF NOT EXISTS). Apply via:
--   Supabase Dashboard → SQL Editor, or `supabase db push` if you use the CLI.
-- NOTE: if the tables already exist (created manually in the dashboard) this
-- file only adds indexes/RLS from 0002 — run that file too.

create extension if not exists pgcrypto;

create table if not exists public.sections (
  id         uuid primary key default gen_random_uuid(),
  name_en    text not null,
  name_am    text,
  type       text not null check (type in ('cafe', 'restaurant')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id             uuid primary key default gen_random_uuid(),
  section_id     uuid not null references public.sections(id) on delete cascade,
  name_en        text not null,
  name_am        text,
  description_en text,
  description_am text,
  price          numeric(10, 2) not null check (price >= 0),
  sort_order     integer not null default 0,
  available      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists idx_sections_type_order
  on public.sections (type, sort_order);

create index if not exists idx_menu_items_section_order
  on public.menu_items (section_id, sort_order);

-- Enabling RLS on already-existing tables is in 0002 below.
alter table public.sections enable row level security;
alter table public.menu_items enable row level security;
