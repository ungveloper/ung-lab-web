-- Apply in Supabase SQL Editor once, before inserting 002 seed data.
-- This catalog is public metadata. Do not add user files or chat messages to this table.
create table if not exists public.tool_catalog (
  slug text primary key check (slug ~ '^[a-z][a-z0-9-]{1,63}$'),
  title text not null,
  subtitle text not null default '',
  category text not null check (category in ('pdf','image','document')),
  tags text[] not null default '{}',
  aliases text[] not null default '{}',
  icon text not null,
  featured boolean not null default false,
  steps text[] not null default '{}',
  formats text not null default '',
  details text[] not null default '{}',
  display_order integer not null default 100,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.tool_catalog enable row level security;
revoke all on public.tool_catalog from anon, authenticated;
grant select on public.tool_catalog to anon, authenticated;
drop policy if exists "Public can read active tool metadata" on public.tool_catalog;
create policy "Public can read active tool metadata"
  on public.tool_catalog for select to anon, authenticated
  using (is_active = true);
-- Only Supabase project administrators may edit or add tool metadata.
-- There are intentionally no public INSERT/UPDATE/DELETE policies.
