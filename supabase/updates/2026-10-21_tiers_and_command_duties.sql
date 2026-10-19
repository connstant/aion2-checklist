-- One-off update for an existing database. Run once in the Supabase SQL Editor.
begin;

-- 1. Schema: tier columns (same as migrations/20261021000000_task_tiers.sql)
alter table public.tasks
  add column tiers jsonb check (tiers is null or jsonb_typeof(tiers) = 'array');
alter table public.task_progress
  add column tier_counts jsonb check (tier_counts is null or jsonb_typeof(tier_counts) = 'object');

-- 2. Command Duties: 12 per server, account-wide
update public.tasks
set scope = 'account',
    max_entries = 12,
    note_reset = 'Resets Wed 07:00 UTC · 12 per server, shared by all characters'
where name = 'Command Duties' and owner_id is null;

-- 3. Abyss Command Duties: per-rarity limits (PLACEHOLDER counts, edit to match the game)
update public.tasks
set tiers = '[{"key": "gold", "label": "Gold", "max": 2}, {"key": "blue", "label": "Blue", "max": 3}]',
    max_entries = 5,
    note_reset = 'Resets Wed 07:00 UTC · separate limit per rarity'
where name = 'Abyss Command Duties' and owner_id is null;

commit;
