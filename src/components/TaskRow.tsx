import type { Task } from '../lib/types'

interface Props {
  task: Task
  count: number
  onChange: (count: number) => void
  onDelete?: () => void
}

export default function TaskRow({ task, count, onChange, onDelete }: Props) {
  const done = count >= task.max_entries
  const single = task.max_entries === 1

  return (
    <li className={`flex gap-3 rounded-lg border p-3 ${done ? 'border-emerald-900 bg-emerald-950/30' : 'border-slate-800 bg-slate-900'}`}>
      {single ? (
        <input
          type="checkbox"
          checked={done}
          onChange={(e) => onChange(e.target.checked ? 1 : 0)}
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-emerald-500"
          aria-label={task.name}
        />
      ) : (
        <div className="flex shrink-0 items-start gap-1">
          <button
            onClick={() => onChange(count - 1)}
            disabled={count <= 0}
            className="h-7 w-7 rounded bg-slate-800 font-bold hover:bg-slate-700 disabled:opacity-30"
            aria-label={`Remove one ${task.name} entry`}
          >
            −
          </button>
          <span className={`w-12 pt-1 text-center text-sm tabular-nums ${done ? 'text-emerald-400' : ''}`}>
            {count}/{task.max_entries}
          </span>
          <button
            onClick={() => onChange(count + 1)}
            disabled={done}
            className="h-7 w-7 rounded bg-slate-800 font-bold hover:bg-slate-700 disabled:opacity-30"
            aria-label={`Add one ${task.name} entry`}
          >
            +
          </button>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${done ? 'text-slate-400 line-through' : ''}`}>{task.name}</span>
          {task.scope === 'account' && (
            <span className="rounded bg-slate-800 px-1.5 text-xs text-slate-400">{task.cadence}</span>
          )}
          {task.owner_id && <span className="rounded bg-indigo-950 px-1.5 text-xs text-indigo-300">custom</span>}
          {onDelete && (
            <button onClick={onDelete} className="ml-auto text-xs text-slate-500 hover:text-red-400">
              delete
            </button>
          )}
        </div>
        {task.note_todo && <p className="mt-0.5 text-sm text-slate-300">{task.note_todo}</p>}
        {task.note_reset && <p className="mt-0.5 text-xs text-amber-300/80">⟳ {task.note_reset}</p>}
        {!single && (
          <div className="mt-2 h-1 overflow-hidden rounded bg-slate-800">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(count / task.max_entries) * 100}%` }} />
          </div>
        )}
      </div>
    </li>
  )
}
