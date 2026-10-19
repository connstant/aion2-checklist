-- One-off update for an existing database (seed.sql already includes these changes).
-- Run once in the Supabase SQL Editor.
begin;

-- Weekly Duty -> Command Duties (keeps existing progress), plus Abyss Command Duties
update public.tasks
set name = 'Command Duties',
    note_todo = 'Complete the weekly Command Duty quests.'
where name = 'Weekly Duty' and owner_id is null;

insert into public.tasks (name, cadence, scope, max_entries, category, sort_order, note_todo, note_reset) values
('Abyss Command Duties', 'weekly', 'character', 3, 'Missions', 125,
  'Complete the weekly Abyss Command Duty quests.',
  'Resets Wed 07:00 UTC · 3 per week');

-- Ascension Trial: 3 per week
update public.tasks
set max_entries = 3,
    note_todo = 'Run Ascension Trial.',
    note_reset = 'Refills Wed 07:00 UTC · 3 entries · unused entries are lost'
where name = 'Ascension Trial' and owner_id is null;

-- Remove Conquest & Transcendence
delete from public.tasks where name = 'Conquest & Transcendence' and owner_id is null;

-- Odyle Energy Crafts: 16 per character + 4 account-wide, weekly
insert into public.tasks (name, cadence, scope, max_entries, category, sort_order, note_todo, note_reset) values
('Odyle Energy Crafts', 'weekly', 'character', 16, 'Crafting', 160,
  'Use your Odyle Energy crafts on this character.',
  'Resets Wed 07:00 UTC · 16 per character per week'),
('Odyle Energy Crafts', 'weekly', 'account', 4, 'Crafting', 170,
  'Use your account-wide Odyle Energy crafts.',
  'Resets Wed 07:00 UTC · 4 per account per week');

commit;
