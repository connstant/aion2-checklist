import type { SupabaseClient } from '@supabase/supabase-js'
import { useState } from 'react'

export default function Login({ client }: { client: SupabaseClient }) {
  const [error, setError] = useState<string | null>(null)

  async function signIn() {
    const { error } = await client.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: window.location.origin },
    })
    if (error) setError(error.message)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
        <h1 className="text-2xl font-bold text-amber-400">AION2 Clan Checklist</h1>
        <p className="mt-2 text-sm text-slate-400">Track your dailies and weeklies. They reset automatically.</p>
        <button
          onClick={signIn}
          className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold hover:bg-indigo-500"
        >
          Sign in with Discord
        </button>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>
    </div>
  )
}
