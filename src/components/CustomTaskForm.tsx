import { useState } from 'react'
import type { Cadence } from '../lib/resets'
import type { Scope } from '../lib/types'

export interface NewTask {
  name: string
  cadence: Cadence
  scope: Scope
  max_entries: number
  note_todo: string | null
  note_reset: string | null
}

const input = 'rounded-md border border-line-strong bg-page px-2 py-1.5 text-sm'

export default function CustomTaskForm({ onAdd, onClose }: { onAdd: (t: NewTask) => Promise<void>; onClose: () => void }) {
  const [t, setT] = useState<NewTask>({ name: '', cadence: 'daily', scope: 'character', max_entries: 1, note_todo: '', note_reset: '' })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!t.name.trim()) return
    await onAdd({ ...t, name: t.name.trim(), note_todo: t.note_todo?.trim() || null, note_reset: t.note_reset?.trim() || null })
    onClose()
  }

  return (
    <form onSubmit={submit} className="mt-4 grid gap-2 rounded-xl border border-line bg-card p-4 sm:grid-cols-2">
      <h2 className="font-semibold sm:col-span-2">New custom task</h2>
      <input value={t.name} onChange={(e) => setT({ ...t, name: e.target.value })} placeholder="Task name" maxLength={60} className={input} />
      <div className="flex gap-2">
        <select value={t.cadence} onChange={(e) => setT({ ...t, cadence: e.target.value as Cadence })} className={`${input} flex-1`}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <select value={t.scope} onChange={(e) => setT({ ...t, scope: e.target.value as Scope })} className={`${input} flex-1`}>
          <option value="character">Per character</option>
          <option value="account">Account-wide</option>
        </select>
        <input
          type="number" min={1} max={99} value={t.max_entries}
          onChange={(e) => setT({ ...t, max_entries: Number(e.target.value) || 1 })}
          className={`${input} w-20`} aria-label="Max entries" title="Entries per reset"
        />
      </div>
      <input value={t.note_todo ?? ''} onChange={(e) => setT({ ...t, note_todo: e.target.value })} placeholder="What to do" className={input} />
      <input value={t.note_reset ?? ''} onChange={(e) => setT({ ...t, note_reset: e.target.value })} placeholder="Reset / entries note" className={input} />
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm text-muted hover:text-fg">Cancel</button>
        <button className="rounded-md bg-amber-600 text-white px-3 py-1.5 text-sm font-semibold hover:bg-amber-500">Add task</button>
      </div>
    </form>
  )
}
