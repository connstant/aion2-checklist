# Setup

## 1. Supabase project
1. Create a project at https://supabase.com (free tier is fine).
2. Open **SQL Editor** and run, in order:
   - `supabase/migrations/20261019000000_init.sql` (tables, security rules)
   - `supabase/seed.sql` (default daily/weekly tasks; run once)
   - Or with the Supabase CLI: `supabase link --project-ref <ref>` then `supabase db push`, and run the seed in the SQL editor.
3. **Project Settings → API**: copy the Project URL and the `anon` public key.

## 2. Discord login
1. https://discord.com/developers/applications → **New Application** → **OAuth2**.
2. Add redirect: `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. Copy the Client ID and Client Secret.
4. Supabase → **Authentication → Sign In / Providers → Discord**: enable it and paste both.

## 3. Run locally
```bash
cp .env.example .env.local   # fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev                  # http://localhost:5173
npm test                     # reset-time unit tests
```
Supabase → **Authentication → URL Configuration**: add `http://localhost:5173/**` to Redirect URLs.

Dev tip: `http://localhost:5173/?now=2026-10-21T07:05:00Z` fakes the clock so you can see checkboxes clear after a reset.

## 4. Deploy to Vercel
1. Push this folder to a GitHub repo.
2. https://vercel.com/new → import the repo. It detects Vite (build `npm run build`, output `dist`).
3. Before deploying, add **Environment Variables**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Deploy. Every push to `main` redeploys automatically.
5. Supabase → **Authentication → URL Configuration**:
   - Site URL: `https://<your-app>.vercel.app`
   - Redirect URLs: `https://<your-app>.vercel.app/**` and `https://*-<your-vercel-team>.vercel.app/**` (preview builds)

`vercel.json` rewrites every path to `index.html` so refreshes work.

## Changing tasks or reset times
- Reset hour and weekday: `src/config/region.ts`
- Default tasks: edit rows in Supabase **Table Editor → tasks** (`owner_id` empty = shared default). Each user can also add custom tasks in the app.

## Is the anon key safe to expose?
Yes. It ships to every browser by design. Security comes from the Row Level Security policies in the migration: a signed-in user can only read and write their own characters and progress.
