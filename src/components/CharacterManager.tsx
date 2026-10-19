import { useState } from 'react'
import type { Character } from '../lib/types'

const CLASSES = ['Gladiator', 'Templar', 'Assassin', 'Ranger', 'Sorcerer', 'Spiritmaster', 'Cleric', 'Chanter']

interface Props {
  characters: Character[]
  onAdd: (c: { name: string; server: string | null; class: string | null }) => Promise<void>
  onRename: (c: Character, name: string) => Promise<void>
  onDelete: (c: Character) => Promise<void>
  onClose: () => void
}

const input = 'rounded-md border border-line-strong bg-page px-2 py-1.5 text-sm'

export default function CharacterManager({ characters, onAdd, onRename, onDelete, onClose }: Props) {
  const [name, setName] = useState('')
  const [server, setServer] = useState('')
  const [cls, setCls] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    await onAdd({ name: name.trim(), server: server.trim() || null, class: cls || null })
    setName('')
  }

  return (
    <div className="mt-4 rounded-xl border border-line bg-card p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Characters</h2>
        <button onClick={onClose} className="text-sm text-muted hover:text-fg">done</button>
      </div>

      <ul className="mt-3 space-y-2">
        {characters.map((c) => (
          <li key={c.id} className="flex items-center gap-2">
            <input
              defaultValue={c.name}
              onBlur={(e) => e.target.value.trim() && e.target.value !== c.name && onRename(c, e.target.value.trim())}
              className={`${input} flex-1`}
              aria-label="Character name"
            />
            <span className="w-32 truncate text-sm text-muted">{[c.class, c.server].filter(Boolean).join(' · ')}</span>
            <button
              onClick={() => confirm(`Delete ${c.name} and its progress?`) && onDelete(c)}
              className="text-sm text-faint hover:text-danger-fg"
            >
              delete
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={submit} className="mt-4 flex flex-wrap gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Character name" maxLength={32} className={`${input} flex-1`} />
        <input value={server} onChange={(e) => setServer(e.target.value)} placeholder="Server (optional)" className={`${input} w-40`} />
        <select value={cls} onChange={(e) => setCls(e.target.value)} className={input}>
          <option value="">Class</option>
          {CLASSES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button className="rounded-md bg-amber-600 text-white px-3 py-1.5 text-sm font-semibold hover:bg-amber-500">Add</button>
      </form>
    </div>
  )
}
