-- Idempotent setup for GrndWrk dashboard
-- Safe to run multiple times. Creates tables, FKs, RLS, policies, and bucket only if missing.

-- 1) Extensions
create extension if not exists pgcrypto;

-- 2) Users table (custom estimators directory) in public schema
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  fullname text not null,
  email text unique
);

-- 3) Quotes table
create table if not exists public.quotes (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now()
);

-- Ensure required columns exist (no type coercion is attempted)
alter table public.quotes add column if not exists fullname text;
alter table public.quotes add column if not exists email text;
alter table public.quotes add column if not exists phone text;
alter table public.quotes add column if not exists address text;
alter table public.quotes add column if not exists service_type text;
alter table public.quotes add column if not exists square_footage integer;
alter table public.quotes add column if not exists additional_info text;
alter table public.quotes add column if not exists photo_urls text[] default '{}'::text[];
alter table public.quotes add column if not exists estimate numeric;
alter table public.quotes add column if not exists appointment_date date;
alter table public.quotes add column if not exists appointment_time time;
alter table public.quotes add column if not exists status text default 'New';
alter table public.quotes add column if not exists notes text;
alter table public.quotes add column if not exists assigned_to uuid null;

-- 3a) FK from quotes.assigned_to -> public.users(id)
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'quotes'
      and constraint_name = 'quotes_assigned_to_fkey'
  ) then
    alter table public.quotes
      add constraint quotes_assigned_to_fkey
      foreign key (assigned_to) references public.users(id)
      on delete set null;
  end if;
end $$;

-- 3b) Optional: constrain status values
do $$
begin
  -- Normalize existing status values before adding the constraint to avoid violations
  -- Map common historic values to the current allowed set
  update public.quotes set status = 'New' where status is null or btrim(status) = '';
  update public.quotes set status = 'Scheduled' where lower(status) in ('scheduled','confirm','confirmed');
  update public.quotes set status = 'Contacted' where lower(status) in ('contacted');
  update public.quotes set status = 'Quote Sent' where lower(status) in (
    'quote sent','quotesent','quote_sent','quote-sent','completed','complete'
  );
  -- As a final safety net, coerce any remaining unknown values to 'New'
  update public.quotes
  set status = 'New'
  where lower(btrim(coalesce(status,''))) not in ('new','contacted','scheduled','quote sent');

  if not exists (
    select 1 from information_schema.check_constraints
    where constraint_schema = 'public'
      and constraint_name = 'quotes_status_check'
  ) then
    alter table public.quotes
      add constraint quotes_status_check
      check (status in ('New','Contacted','Scheduled','Quote Sent'));
  end if;
end $$;

-- 4) RLS + policies (development-friendly; tighten for production)
alter table public.quotes enable row level security;
alter table public.users enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'quotes' and policyname = 'quotes_select_all'
  ) then
    create policy "quotes_select_all" on public.quotes for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'quotes' and policyname = 'quotes_insert_all'
  ) then
    create policy "quotes_insert_all" on public.quotes for insert with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'quotes' and policyname = 'quotes_update_all'
  ) then
    create policy "quotes_update_all" on public.quotes for update using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'users' and policyname = 'users_select_all'
  ) then
    create policy "users_select_all" on public.users for select using (true);
  end if;
end $$;

-- 5) Seed a few estimators (idempotent by email)
insert into public.users (fullname, email)
values
  ('Alex Estimator', 'alex@example.com'),
  ('Jamie Johnson', 'jamie@example.com'),
  ('Taylor Rivera', 'taylor@example.com')
on conflict (email) do nothing;

-- 6) Storage bucket for quote photos (public read)
insert into storage.buckets (id, name, public)
values ('quote-photos', 'quote-photos', true)
on conflict (id) do nothing;

-- Public read access to objects in the quote-photos bucket
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'quote_photos_public_read'
  ) then
    create policy "quote_photos_public_read" on storage.objects
      for select
      using (bucket_id = 'quote-photos');
  end if;
end $$;

-- 7) Helpful indexes
create index if not exists quotes_created_at_idx on public.quotes (created_at desc);
create index if not exists quotes_status_idx on public.quotes (status);
create index if not exists quotes_assigned_to_idx on public.quotes (assigned_to);

-- 9) Settings table (keyed JSON) for pricing/business settings
create table if not exists public.settings (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'settings' and policyname = 'settings_select_all'
  ) then
    create policy "settings_select_all" on public.settings for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'settings' and policyname = 'settings_upsert_all'
  ) then
    create policy "settings_upsert_all" on public.settings for insert with check (true);
    create policy "settings_update_all" on public.settings for update using (true);
  end if;
end $$;

-- 8) Verification queries (run manually to inspect state)
-- select * from public.users limit 10;
-- select id, fullname, status, assigned_to, created_at from public.quotes order by created_at desc limit 20;
-- select id, name, public from storage.buckets where id = 'quote-photos';
