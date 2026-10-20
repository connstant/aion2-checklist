-- Duties: 5 per day per server (account-wide), listed first in the Account-wide section. Safe to re-run.
update public.tasks
set scope = 'account',
    sort_order = 5,
    note_reset = 'Resets daily 07:00 UTC · 5 per day per server, shared by all characters'
where name = 'Duties' and owner_id is null;
