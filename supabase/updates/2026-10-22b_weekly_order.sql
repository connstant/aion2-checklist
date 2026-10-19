-- Put Subjugation and Raid at the bottom of the weekly list. Safe to re-run.
update public.tasks set sort_order = 180 where name = 'Subjugation' and owner_id is null;
update public.tasks set sort_order = 190 where name = 'Raid' and owner_id is null;
