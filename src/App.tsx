import type { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import { supabase } from './lib/supabase'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (!supabase) return <NotConfigured />
  if (loading) return <div className="p-8 text-slate-400">Loading…</div>
  if (!session) return <Login client={supabase} />
  return <Dashboard client={supabase} session={session} />
}

function NotConfigured() {
  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-bold text-amber-400">Supabase not configured</h1>
      <p className="mt-3 text-slate-300">
        Copy <code className="text-amber-200">.env.example</code> to <code className="text-amber-200">.env.local</code>{' '}
        and fill in <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>, then restart{' '}
        <code>npm run dev</code>. On Vercel, set them under Project → Settings → Environment Variables. See SETUP.md.
      </p>
    </div>
  )
}
