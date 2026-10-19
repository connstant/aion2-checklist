import { taskMax, type Task, type Tier, type TierCounts } from '../lib/types'

interface Props {
  task: Task
  count: number
  tierCounts: TierCounts
  onChange: (count: number) => void
  onTierChange: (tierKey: string, count: number) => void
  onDelete?: () => void
}

// Full class names so Tailwind picks them up.
const TIER_COLORS: Record<string, string> = {
  gold: 'bg-amber-400',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
  blue: 'bg-sky-500',
  green: 'bg-emerald-500',
  white: 'bg-slate-400',
  red: 'bg-red-500',
}
const tierColor = (tier: Tier) => TIER_COLORS[(tier.color ?? tier.key).toLowerCase()] ?? 'bg-slate-400'

export default function TaskRow({ task, count, tierCounts, onChange, onTierChange, onDelete }: Props) {
  const max = taskMax(task)
  const done = count >= max
  const tiers = task.tiers?.length ? task.tiers : null
  const single = !tiers && max === 1

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
      ) : tiers ? (
        <span className={`w-28 shrink-0 pt-1 text-center text-sm tabular-nums ${done ? 'text-done-fg' : 'text-muted'}`}>
          {count}/{max}
        </span>
      ) : (
        <Counter label={task.name} count={count} max={max} done={done} onChange={onChange} />
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

        {tiers && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tiers.map((tier) => {
              const c = Math.min(tierCounts[tier.key] ?? 0, tier.max)
              const full = c >= tier.max
              return (
                <div key={tier.key} className={`flex items-center gap-2 rounded-md border py-1 pr-1 pl-2 ${full ? 'border-done-line' : 'border-line'}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${tierColor(tier)}`} />
                  <span className={`text-sm ${full ? 'text-muted' : ''}`}>{tier.label}</span>
                  <Counter label={`${task.name} ${tier.label}`} count={c} max={tier.max} done={full} onChange={(n) => onTierChange(tier.key, n)} small />
                </div>
              )
            })}
          </div>
        )}

        {tiers ? (
          // one segment per tier, sized by its share of the total
          <div className="mt-2 flex h-1 gap-0.5 overflow-hidden rounded">
            {tiers.map((tier) => (
              <div key={tier.key} className="h-full bg-raised" style={{ flex: tier.max }}>
                <div className={`h-full transition-all ${tierColor(tier)}`} style={{ width: `${(Math.min(tierCounts[tier.key] ?? 0, tier.max) / tier.max) * 100}%` }} />
              </div>
            ))}
          </div>
        ) : (
          !single && (
            <div className="mt-2 h-1 overflow-hidden rounded bg-raised">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(count / max) * 100}%` }} />
            </div>
          )
        )}
      </div>
    </li>
  )
}

interface CounterProps {
  label: string
  count: number
  max: number
  done: boolean
  onChange: (count: number) => void
  small?: boolean
}

function Counter({ label, count, max, done, onChange, small }: CounterProps) {
  const btn = `${small ? 'h-6 w-6' : 'h-7 w-7'} rounded bg-raised font-bold hover:bg-raised-hover disabled:opacity-30`
  return (
    <div className={`flex shrink-0 items-center gap-1 ${small ? '' : 'self-start'}`}>
      <button onClick={() => onChange(count - 1)} disabled={count <= 0} className={btn} aria-label={`Remove one ${label} entry`}>
        −
      </button>
      <span className={`${small ? 'w-9 text-xs' : 'w-12 text-sm'} text-center tabular-nums ${done ? 'text-done-fg' : ''}`}>
        {count}/{max}
      </span>
      <button onClick={() => onChange(count + 1)} disabled={done} className={btn} aria-label={`Add one ${label} entry`}>
        +
      </button>
    </div>
  )
}
