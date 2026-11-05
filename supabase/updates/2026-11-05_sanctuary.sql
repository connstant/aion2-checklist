-- Add Sanctuary weekly (once per character). Run once (re-running adds duplicates).
insert into public.tasks (name, cadence, scope, max_entries, category, sort_order, note_todo, note_reset) values
('Sanctuary', 'weekly', 'character', 1, 'Raids', 185,
  'Clear Sanctuary on this character.',
  'Resets Wed 07:00 UTC · once per character per week');
