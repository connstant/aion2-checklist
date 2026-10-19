import { useEffect, useState } from 'react'

// In dev, `?now=2026-10-21T07:05:00Z` shifts the app clock so you can test resets.
const offsetMs = (() => {
  if (!import.meta.env.DEV) return 0
  const fake = new URLSearchParams(window.location.search).get('now')
  const parsed = fake ? Date.parse(fake) : NaN
  return Number.isNaN(parsed) ? 0 : parsed - Date.now()
})()

/** Current time, re-rendering every `intervalMs` so checkboxes clear when a reset passes. */
export function useNow(intervalMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date(Date.now() + offsetMs))
  useEffect(() => {
    const id = setInterval(() => setNow(new Date(Date.now() + offsetMs)), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
