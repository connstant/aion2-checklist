-- Add Abyss Time and Battlefield Wins weeklies. Run once (re-running adds duplicates).
insert into public.tasks (name, cadence, scope, max_entries, category, sort_order, note_todo, note_reset) values
('Abyss Time', 'weekly', 'character', 1, 'Abyss', 172,
  'Use your Abyss time on this character.',
  'Resets Wed 07:00 UTC · 7 hours per character per week'),
('Battlefield Wins', 'weekly', 'character', 3, 'PvP', 175,
  'Win 3 Battlefield matches.',
  'Resets Wed 07:00 UTC · 3 wins per character per week');
