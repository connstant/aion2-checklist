-- AION2 Clan Checklist schema
--
-- Checklist resets are NOT done by deleting rows. Each progress row stores
-- `updated_at`; the app treats a row as "done" only if updated_at falls inside
-- the current daily/weekly reset period. No cron job needed.

-- ---------------------------------------------------------------------------
-- profiles: one row per Discord user, created automatically on first sign-in
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  discord_username text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, discord_username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- characters: a user's in-game characters
-- ---------------------------------------------------------------------------
create table public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 32),
  server text,
  class text,
  -- filled by character lookup (phase 2)
  aion_ref text,
  combat_power integer,
  last_synced_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index characters_user_id_idx on public.characters (user_id);

-- ---------------------------------------------------------------------------
-- tasks: checklist items. owner_id null = shared default task (seeded),
-- otherwise a user's custom task.
-- ---------------------------------------------------------------------------
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  cadence text not null check (cadence in ('daily', 'weekly')),
  -- 'character' = tracked per character, 'account' = once per account/server
  scope text not null default 'character' check (scope in ('character', 'account')),
  max_entries integer not null default 1 check (max_entries between 1 and 99),
  note_todo text,
  note_reset text,
  category text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index tasks_owner_id_idx on public.tasks (owner_id);

-- ---------------------------------------------------------------------------
-- task_progress: how many entries of a task were used, and when.
-- character_id is null for account-scoped tasks.
-- ---------------------------------------------------------------------------
create table public.task_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  character_id uuid references public.characters (id) on delete cascade,
  task_id uuid not null references public.tasks (id) on delete cascade,
  count integer not null default 0 check (count >= 0),
  updated_at timestamptz not null default now(),
  -- nulls not distinct: only one account-level row (character_id null) per user+task
  constraint task_progress_unique unique nulls not distinct (user_id, character_id, task_id)
);

-- The server sets the timestamp so a wrong client clock can't break resets.
create function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger task_progress_touch
  before insert or update on public.task_progress
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security: everyone signs in, but only sees/edits their own data.
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.characters enable row level security;
alter table public.tasks enable row level security;
alter table public.task_progress enable row level security;

-- profiles: clanmates can see each other's names (useful for a future clan view)
create policy "profiles readable by signed-in users" on public.profiles
  for select to authenticated using (true);
create policy "update own profile" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- characters: own only
create policy "own characters" on public.characters
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- tasks: read defaults + own custom tasks; write own custom tasks only
create policy "read default and own tasks" on public.tasks
  for select to authenticated
  using (owner_id is null or owner_id = (select auth.uid()));
create policy "insert own tasks" on public.tasks
  for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "update own tasks" on public.tasks
  for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "delete own tasks" on public.tasks
  for delete to authenticated using (owner_id = (select auth.uid()));

-- task_progress: own only, and only for own characters / visible tasks
create policy "own progress" on public.task_progress
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and (
      character_id is null
      or exists (select 1 from public.characters c where c.id = character_id and c.user_id = (select auth.uid()))
    )
    and exists (
      select 1 from public.tasks t
      where t.id = task_id and (t.owner_id is null or t.owner_id = (select auth.uid()))
    )
  );
