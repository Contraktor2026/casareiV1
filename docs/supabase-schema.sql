-- Casarei initial Supabase schema.
-- Run this in Supabase SQL Editor after creating the project.

create extension if not exists "pgcrypto";

create table if not exists public.weddings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid,
  couple_name text not null,
  bride_name text,
  partner_name text,
  wedding_date date,
  city text,
  state text,
  style text[] default '{}',
  wedding_format text,
  ceremony_type text,
  guest_count_estimate integer default 0,
  planned_budget numeric(12,2) default 0,
  priorities text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.guest_groups (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  name text not null,
  tone text,
  created_at timestamptz not null default now()
);

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  group_id uuid references public.guest_groups(id) on delete set null,
  first_name text not null,
  last_name text,
  phone text,
  email text,
  relation text,
  companions_allowed integer default 0,
  children_count integer default 0,
  food_notes text,
  internal_note text,
  rsvp_status text not null default 'pending',
  rsvp_token text not null default encode(gen_random_bytes(12), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seating_tables (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  name text not null,
  capacity integer not null default 10,
  location text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.seating_assignments (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  table_id uuid not null references public.seating_tables(id) on delete cascade,
  guest_id uuid not null references public.guests(id) on delete cascade,
  seats integer not null default 1,
  unique(table_id, guest_id)
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  name text not null,
  category text not null,
  status text not null default 'cotando',
  city text,
  contact_name text,
  phone text,
  email text,
  total_value numeric(12,2) default 0,
  paid_value numeric(12,2) default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  vendor_id uuid references public.vendors(id) on delete set null,
  vendor_name text not null,
  category text not null,
  value numeric(12,2) default 0,
  payment_method text,
  due_date date,
  summary text,
  observations text,
  status text not null default 'received',
  source text not null default 'manual',
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  vendor_id uuid references public.vendors(id) on delete set null,
  quote_id uuid references public.quotes(id) on delete set null,
  supplier text not null,
  category text not null,
  amount numeric(12,2) not null,
  due_date date not null,
  method text,
  status text not null default 'pending',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  title text not null,
  description text,
  category text,
  due_date date,
  status text not null default 'pending',
  priority text default 'medium',
  source text default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  vendor_id uuid references public.vendors(id) on delete cascade,
  quote_id uuid references public.quotes(id) on delete cascade,
  name text not null,
  storage_path text not null,
  content_type text,
  size_bytes integer,
  uploaded_at timestamptz not null default now()
);

create table if not exists public.day_notes (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  note_date date not null,
  note text,
  updated_at timestamptz not null default now(),
  unique(wedding_id, note_date)
);

alter table public.weddings enable row level security;
alter table public.guest_groups enable row level security;
alter table public.guests enable row level security;
alter table public.seating_tables enable row level security;
alter table public.seating_assignments enable row level security;
alter table public.vendors enable row level security;
alter table public.quotes enable row level security;
alter table public.payments enable row level security;
alter table public.tasks enable row level security;
alter table public.files enable row level security;
alter table public.day_notes enable row level security;

-- MVP policy: authenticated users can manage their own weddings.
-- If you keep fake auth for now, use the service role only on trusted server routes.
create policy "weddings_owner_all" on public.weddings
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "related_wedding_owner_all_guest_groups" on public.guest_groups
  for all using (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()))
  with check (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()));

create policy "related_wedding_owner_all_guests" on public.guests
  for all using (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()))
  with check (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()));

create policy "related_wedding_owner_all_tables" on public.seating_tables
  for all using (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()))
  with check (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()));

create policy "related_wedding_owner_all_assignments" on public.seating_assignments
  for all using (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()))
  with check (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()));

create policy "related_wedding_owner_all_vendors" on public.vendors
  for all using (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()))
  with check (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()));

create policy "related_wedding_owner_all_quotes" on public.quotes
  for all using (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()))
  with check (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()));

create policy "related_wedding_owner_all_payments" on public.payments
  for all using (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()))
  with check (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()));

create policy "related_wedding_owner_all_tasks" on public.tasks
  for all using (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()))
  with check (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()));

create policy "related_wedding_owner_all_files" on public.files
  for all using (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()))
  with check (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()));

create policy "related_wedding_owner_all_day_notes" on public.day_notes
  for all using (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()))
  with check (exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid()));
