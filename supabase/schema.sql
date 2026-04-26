-- Table for contribution form submissions
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text not null,
  year text,
  location text,
  created_at timestamptz not null default now()
);

-- Helpful index for newest-first queries
create index if not exists submissions_created_at_idx on public.submissions (created_at desc);

-- Basic RLS setup for demo/public insert+read use-cases
alter table public.submissions enable row level security;

drop policy if exists "Allow public read submissions" on public.submissions;
drop policy if exists "Allow public insert submissions" on public.submissions;

create policy "Allow public read submissions"
  on public.submissions
  for select
  to public
  using (true);

create policy "Allow public insert submissions"
  on public.submissions
  for insert
  to public
  with check (true);

grant usage on schema public to anon, authenticated;
grant select, insert on public.submissions to anon, authenticated;

-- Storage policies for the public "uploads" bucket used by ContributionForm.
-- Create the bucket in Supabase Storage first if it does not exist.
drop policy if exists "Allow public read uploads" on storage.objects;
drop policy if exists "Allow public upload inserts" on storage.objects;

create policy "Allow public read uploads"
  on storage.objects
  for select
  to public
  using (bucket_id = 'uploads');

create policy "Allow public upload inserts"
  on storage.objects
  for insert
  to public
  with check (bucket_id = 'uploads');
