-- Default checklist tasks (shared by everyone; owner_id = null).
-- Entry counts come from community guides and can change between patches.
-- Edit freely, then re-run, or update rows in the Supabase table editor.
-- Run once: re-running inserts duplicates.

insert into public.tasks (name, cadence, scope, max_entries, category, sort_order, note_todo, note_reset) values
-- Daily ----------------------------------------------------------------------
('Mission Journal', 'daily', 'character', 5, 'Missions', 10,
  'Complete the daily duty/mission journal quests.',
  'Resets daily 07:00 UTC · 5 per day'),
('Nightmare', 'daily', 'character', 2, 'Dungeons', 20,
  'Run Nightmare. Unused attempts carry over, so it''s okay to skip a day.',
  '+2 attempts daily 07:00 UTC · stacks up to about a week'),
('Shugo Festival', 'daily', 'character', 3, 'Events', 30,
  'Hourly event at :00. Clear runs to earn reward keys.',
  'Resets daily 07:00 UTC · 3 reward keys per day'),
('Hidden Cube', 'daily', 'character', 3, 'Events', 40,
  'Open hidden cubes with your daily keys.',
  'Resets daily 07:00 UTC · 3 keys per day'),
('Odyle Energy', 'daily', 'character', 1, 'Upkeep', 50,
  'Spend Odyle Energy so it doesn''t sit at cap.',
  'Refills every 3 hours (timer, not reset)'),
('Dimensional Invasion', 'daily', 'account', 1, 'Events', 60,
  'Event at :30 every hour. Claim the reward key.',
  'Resets daily 07:00 UTC · 1 reward key per server'),

-- Weekly ---------------------------------------------------------------------
('Daily Dungeon', 'weekly', 'character', 14, 'Dungeons', 110,
  'Current daily dungeon: Unknown Fissure. Pace about 2 runs a day.',
  'Refills Wed 07:00 UTC · 14 entries · unused entries are lost'),
('Command Duties', 'weekly', 'character', 3, 'Missions', 120,
  'Complete the weekly Command Duty quests.',
  'Resets Wed 07:00 UTC · 3 per week'),
('Abyss Command Duties', 'weekly', 'character', 3, 'Missions', 125,
  'Complete the weekly Abyss Command Duty quests.',
  'Resets Wed 07:00 UTC · 3 per week'),
('Subjugation', 'weekly', 'character', 3, 'Field', 130,
  'Use your Subjugation tickets.',
  'Refills Wed 07:00 UTC · 3 tickets · unused tickets are lost'),
('Ascension Trial', 'weekly', 'character', 3, 'Dungeons', 140,
  'Run Ascension Trial.',
  'Refills Wed 07:00 UTC · 3 entries · unused entries are lost'),
('Raid', 'weekly', 'character', 1, 'Raids', 150,
  'Clear your weekly raid(s) with the clan.',
  'Refills Wed 07:00 UTC · unused attempts are lost'),
('Odyle Energy Crafts', 'weekly', 'character', 16, 'Crafting', 160,
  'Use your Odyle Energy crafts on this character.',
  'Resets Wed 07:00 UTC · 16 per character per week'),
('Odyle Energy Crafts', 'weekly', 'account', 4, 'Crafting', 170,
  'Use your account-wide Odyle Energy crafts.',
  'Resets Wed 07:00 UTC · 4 per account per week');
