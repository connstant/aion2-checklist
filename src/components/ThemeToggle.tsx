import { useState } from 'react'

const KEY = 'aion2.theme'

export default function ThemeToggle() {
  // index.html sets the initial class, so read it back from the DOM
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem(KEY, next ? 'dark' : 'light')
    } catch {
      // storage blocked; theme still applies for this visit
    }
  }

  return (
    <button
      onClick={toggle}
      className="rounded-md px-2 py-1 text-muted hover:bg-raised hover:text-fg"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
    >
      {dark ? '☀' : '☾'}
    </button>
  )
}
