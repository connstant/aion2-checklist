import type { SupabaseClient } from '@supabase/supabase-js'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

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
    <div className="relative flex min-h-screen items-center justify-center p-6">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm rounded-xl border border-line bg-card p-8 text-center">
        <h1 className="text-2xl font-bold text-brand">AION2 Clan Checklist</h1>
        <p className="mt-2 text-sm text-muted">Track your dailies and weeklies. They reset automatically.</p>
        <button
          onClick={signIn}
          className="mt-6 w-full rounded-lg bg-indigo-600 text-white px-4 py-2.5 font-semibold hover:bg-indigo-500"
        >
          Sign in with Discord
        </button>
        {error && <p className="mt-3 text-sm text-danger-fg">{error}</p>}
      </div>
    </div>
  )
}
