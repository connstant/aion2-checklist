-- One-off update for an existing database. Run once in the Supabase SQL Editor.
-- Safe even if 2026-10-21_tiers_and_command_duties.sql was not run.
begin;

-- tier columns (no-op if they already exist)
alter table public.tasks
  add column if not exists tiers jsonb check (tiers is null or jsonb_typeof(tiers) = 'array');
alter table public.task_progress
  add column if not exists tier_counts jsonb check (tier_counts is null or jsonb_typeof(tier_counts) = 'object');

-- Command Duties: 12 per week, server-wide
update public.tasks
set scope = 'account',
    max_entries = 12,
    note_reset = 'Resets Wed 07:00 UTC · 12 per server, shared by all characters'
where name = 'Command Duties' and owner_id is null;

-- Abyss Command Duties: 5 per rarity, server-wide, with reward odds note
update public.tasks
set scope = 'account',
    max_entries = 20,
    tiers = '[{"key": "gold", "label": "Gold", "max": 5}, {"key": "blue", "label": "Blue", "max": 5}, {"key": "green", "label": "Green", "max": 5}, {"key": "gray", "label": "Gray", "max": 5}]',
    note_todo = 'Complete Abyss Command Duties. Rewards: the first item is guaranteed (100%); extra rewards roll at decreasing odds (50% / 33% / 25% / 10%).',
    note_reset = 'Resets Wed 07:00 UTC · 5 per rarity per server, shared by all characters'
where name = 'Abyss Command Duties' and owner_id is null;

-- Mission Journal -> Duties, 5 per day per character
update public.tasks
set name = 'Duties',
    max_entries = 5,
    scope = 'character',
    note_todo = 'Complete your daily Duties.',
    note_reset = 'Resets daily 07:00 UTC · 5 per day per character'
where name = 'Mission Journal' and owner_id is null;

commit;
