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
    <li className={`flex gap-3 rounded-lg border p-3 ${done ? 'border-done-line bg-done-bg' : 'border-line bg-card'}`}>
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
            className="h-7 w-7 rounded bg-raised font-bold hover:bg-raised-hover disabled:opacity-30"
            aria-label={`Remove one ${task.name} entry`}
          >
            −
          </button>
          <span className={`w-12 pt-1 text-center text-sm tabular-nums ${done ? 'text-done-fg' : ''}`}>
            {count}/{task.max_entries}
          </span>
          <button
            onClick={() => onChange(count + 1)}
            disabled={done}
            className="h-7 w-7 rounded bg-raised font-bold hover:bg-raised-hover disabled:opacity-30"
            aria-label={`Add one ${task.name} entry`}
          >
            +
          </button>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${done ? 'text-muted line-through' : ''}`}>{task.name}</span>
          {task.scope === 'account' && (
            <span className="rounded bg-raised px-1.5 text-xs text-muted">{task.cadence}</span>
          )}
          {task.owner_id && <span className="rounded bg-tag-bg px-1.5 text-xs text-tag-fg">custom</span>}
          {onDelete && (
            <button onClick={onDelete} className="ml-auto text-xs text-faint hover:text-danger-fg">
              delete
            </button>
          )}
        </div>
        {task.note_todo && <p className="mt-0.5 text-sm text-fg-2">{task.note_todo}</p>}
        {task.note_reset && <p className="mt-0.5 text-xs text-note">⟳ {task.note_reset}</p>}
        {!single && (
          <div className="mt-2 h-1 overflow-hidden rounded bg-raised">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(count / task.max_entries) * 100}%` }} />
          </div>
        )}
      </div>
    </li>
  )
}
