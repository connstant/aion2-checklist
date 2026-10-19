-- Newer Supabase projects don't auto-grant table access to API roles, so grant
-- it explicitly. RLS policies in the init migration still restrict which rows
-- each user can see. Logged-out (anon) users get no access.
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.characters, public.tasks, public.task_progress to authenticated;
grant select, update on public.profiles to authenticated;
