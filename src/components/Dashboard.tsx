import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { useCallback, useEffect, useState } from 'react'
import { useNow } from '../hooks/useNow'
import { isInCurrentPeriod } from '../lib/resets'
import { progressKey, type Character, type Task, type TaskProgress } from '../lib/types'
import CharacterManager from './CharacterManager'
import CustomTaskForm, { type NewTask } from './CustomTaskForm'
import TaskSection from './TaskSection'

const SELECTED_KEY = 'aion2.selectedCharacter'

export default function Dashboard({ client, session }: { client: SupabaseClient; session: Session }) {
  const userId = session.user.id
  const now = useNow()
  const [characters, setCharacters] = useState<Character[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [progress, setProgress] = useState<Record<string, TaskProgress>>({})
  const [selectedId, setSelectedId] = useState<string | null>(() => localStorage.getItem(SELECTED_KEY))
  const [panel, setPanel] = useState<'characters' | 'task' | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [c, t, p] = await Promise.all([
      client.from('characters').select('*').order('sort_order').order('created_at'),
      client.from('tasks').select('*').order('sort_order').order('created_at'),
      client.from('task_progress').select('*'),
    ])
    const err = c.error ?? t.error ?? p.error
    if (err) setError(err.message)
    setCharacters(c.data ?? [])
    setTasks(t.data ?? [])
    setProgress(Object.fromEntries((p.data ?? []).map((row: TaskProgress) => [progressKey(row.character_id, row.task_id), row])))
    setLoading(false)
  }, [client])

  useEffect(() => {
    load()
  }, [load])

  const selected = characters.find((c) => c.id === selectedId) ?? characters[0] ?? null

  function selectCharacter(id: string) {
    setSelectedId(id)
    localStorage.setItem(SELECTED_KEY, id)
  }

  function charIdFor(task: Task) {
    return task.scope === 'account' ? null : (selected?.id ?? null)
  }

  // A row only counts if it was updated since the last reset; otherwise it's back to 0.
  function getCount(task: Task): number {
    const row = progress[progressKey(charIdFor(task), task.id)]
    return row && isInCurrentPeriod(row.updated_at, task.cadence, now) ? row.count : 0
  }

  async function setCount(task: Task, count: number) {
    const characterId = charIdFor(task)
    const key = progressKey(characterId, task.id)
    const prev = progress[key]
    // optimistic update; the server sets the real updated_at
    setProgress((p) => ({
      ...p,
      [key]: { id: prev?.id ?? 'pending', user_id: userId, character_id: characterId, task_id: task.id, count, updated_at: new Date().toISOString() },
    }))
    const { data, error } = await client
      .from('task_progress')
      .upsert({ user_id: userId, character_id: characterId, task_id: task.id, count }, { onConflict: 'user_id,character_id,task_id' })
      .select()
      .single()
    if (error) {
      setError(error.message)
      setProgress((p) => {
        const next = { ...p }
        if (prev) next[key] = prev
        else delete next[key]
        return next
      })
    } else {
      setProgress((p) => ({ ...p, [key]: data }))
    }
  }

  async function addCharacter(c: { name: string; server: string | null; class: string | null }) {
    const { data, error } = await client
      .from('characters')
      .insert({ ...c, user_id: userId, sort_order: characters.length })
      .select()
      .single()
    if (error) return setError(error.message)
    setCharacters((cs) => [...cs, data])
    selectCharacter(data.id)
  }

  async function renameCharacter(c: Character, name: string) {
    const { error } = await client.from('characters').update({ name }).eq('id', c.id)
    if (error) return setError(error.message)
    setCharacters((cs) => cs.map((x) => (x.id === c.id ? { ...x, name } : x)))
  }

  async function deleteCharacter(c: Character) {
    const { error } = await client.from('characters').delete().eq('id', c.id)
    if (error) return setError(error.message)
    setCharacters((cs) => cs.filter((x) => x.id !== c.id))
  }

  async function addTask(t: NewTask) {
    const { data, error } = await client
      .from('tasks')
      .insert({ ...t, owner_id: userId, sort_order: 1000 + tasks.length })
      .select()
      .single()
    if (error) return setError(error.message)
    setTasks((ts) => [...ts, data])
  }

  async function deleteTask(task: Task) {
    if (!confirm(`Delete custom task "${task.name}"?`)) return
    const { error } = await client.from('tasks').delete().eq('id', task.id)
    if (error) return setError(error.message)
    setTasks((ts) => ts.filter((t) => t.id !== task.id))
  }

  const characterTasks = tasks.filter((t) => t.scope === 'character')
  const sectionProps = { now, getCount, setCount, deleteTask }
  const meta = session.user.user_metadata

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16">
      <header className="flex items-center justify-between py-4">
        <h1 className="text-xl font-bold text-amber-400">AION2 Clan Checklist</h1>
        <div className="flex items-center gap-3 text-sm">
          {meta.avatar_url && <img src={meta.avatar_url} alt="" className="h-7 w-7 rounded-full" />}
          <span className="hidden text-slate-300 sm:inline">{meta.full_name ?? meta.name}</span>
          <button onClick={() => client.auth.signOut()} className="text-slate-400 hover:text-slate-200">Sign out</button>
        </div>
      </header>

      {error && (
        <div className="mb-3 flex justify-between rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-300">
          <span>{error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : (
        <>
          <nav className="flex flex-wrap items-center gap-2">
            {characters.map((c) => (
              <button
                key={c.id}
                onClick={() => selectCharacter(c.id)}
                className={`rounded-full px-3 py-1 text-sm ${c.id === selected?.id ? 'bg-amber-600 font-semibold' : 'bg-slate-800 hover:bg-slate-700'}`}
              >
                {c.name}
              </button>
            ))}
            <button onClick={() => setPanel(panel === 'characters' ? null : 'characters')} className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300 hover:bg-slate-800">
              {characters.length ? 'Manage characters' : '+ Add your first character'}
            </button>
            <button onClick={() => setPanel(panel === 'task' ? null : 'task')} className="ml-auto text-sm text-slate-400 hover:text-slate-200">
              + Custom task
            </button>
          </nav>

          {(panel === 'characters' || characters.length === 0) && (
            <CharacterManager
              characters={characters}
              onAdd={addCharacter}
              onRename={renameCharacter}
              onDelete={deleteCharacter}
              onClose={() => setPanel(null)}
            />
          )}
          {panel === 'task' && <CustomTaskForm onAdd={addTask} onClose={() => setPanel(null)} />}

          {selected && (
            <>
              <TaskSection title="Daily" cadence="daily" tasks={characterTasks.filter((t) => t.cadence === 'daily')} {...sectionProps} />
              <TaskSection title="Weekly" cadence="weekly" tasks={characterTasks.filter((t) => t.cadence === 'weekly')} {...sectionProps} />
            </>
          )}
          <TaskSection title="Account-wide" tasks={tasks.filter((t) => t.scope === 'account')} {...sectionProps} />
        </>
      )}
    </div>
  )
}
