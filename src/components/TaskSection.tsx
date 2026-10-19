import { formatCountdown, nextReset, type Cadence } from '../lib/resets'
import type { Task } from '../lib/types'
import TaskRow from './TaskRow'

interface Props {
  title: string
  tasks: Task[]
  now: Date
  cadence?: Cadence // shows a reset countdown when set
  getCount: (task: Task) => number
  setCount: (task: Task, count: number) => void
  deleteTask: (task: Task) => void
}

export default function TaskSection({ title, tasks, now, cadence, getCount, setCount, deleteTask }: Props) {
  if (tasks.length === 0) return null
  const doneCount = tasks.filter((t) => getCount(t) >= t.max_entries).length

  return (
    <section className="mt-6">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">
          {title} <span className="text-sm font-normal text-muted">{doneCount}/{tasks.length}</span>
        </h2>
        {cadence && (
          <span className="text-sm text-muted">
            resets in {formatCountdown(nextReset(cadence, now).getTime() - now.getTime())}
          </span>
        )}
      </div>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            count={getCount(task)}
            onChange={(c) => setCount(task, Math.max(0, Math.min(task.max_entries, c)))}
            onDelete={task.owner_id ? () => deleteTask(task) : undefined}
          />
        ))}
      </ul>
    </section>
  )
}
