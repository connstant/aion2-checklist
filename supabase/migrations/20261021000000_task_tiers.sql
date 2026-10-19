-- Per-tier limits for a task (e.g. Abyss Command Duties: gold / blue).
-- tasks.tiers:            [{"key": "gold", "label": "Gold", "max": 2}, ...]  (optional "color")
-- task_progress.tier_counts: {"gold": 1, "blue": 3}
-- task_progress.count stays the total, so non-tiered code paths keep working.
alter table public.tasks
  add column tiers jsonb check (tiers is null or jsonb_typeof(tiers) = 'array');

alter table public.task_progress
  add column tier_counts jsonb check (tier_counts is null or jsonb_typeof(tier_counts) = 'object');
