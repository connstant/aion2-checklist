# AION2 Clan Checklist

Daily and weekly checklist for AION 2 (NA servers). Each task has a "what to do" note and a reset/entries note, and checkboxes clear automatically at reset (daily 07:00 UTC, weekly Wednesday 07:00 UTC).

**Stack:** React + Vite + TypeScript + Tailwind · Supabase (Postgres, Discord auth, Row Level Security) · Vercel

**How resets work:** nothing gets deleted at reset. Each progress row stores `updated_at` (set by the database), and the app counts a task as done only if `updated_at` is after the most recent reset (`src/lib/resets.ts`). No cron job needed.

| Path | What |
| --- | --- |
| `src/lib/resets.ts` | reset-period math (+ tests) |
| `src/config/region.ts` | reset hour/day |
| `src/components/Dashboard.tsx` | data loading + checkbox saving |
| `supabase/migrations/` | schema + RLS policies |
| `supabase/seed.sql` | default tasks |

See [SETUP.md](SETUP.md) to get it running and deployed.

Planned: character lookup via a Supabase Edge Function (porting endpoints from [nuriland/aion2-api](https://github.com/nuriland/aion2-api)), and optionally limiting sign-in to your clan's Discord server.
