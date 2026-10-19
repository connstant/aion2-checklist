import type { Cadence } from './resets'

export type Scope = 'character' | 'account'

export interface Character {
  id: string
  user_id: string
  name: string
  server: string | null
  class: string | null
  combat_power: number | null
  sort_order: number
  created_at: string
}

/** One rarity tier of a task with per-tier limits, e.g. { key: 'gold', label: 'Gold', max: 2 }. */
export interface Tier {
  key: string
  label: string
  max: number
  color?: string // gold | orange | purple | blue | green | white | red; defaults to key
}

export type TierCounts = Record<string, number>

export interface Task {
  id: string
  owner_id: string | null
  name: string
  cadence: Cadence
  scope: Scope
  max_entries: number
  note_todo: string | null
  note_reset: string | null
  category: string | null
  sort_order: number
  tiers: Tier[] | null
}

export interface TaskProgress {
  id: string
  user_id: string
  character_id: string | null
  task_id: string
  count: number
  tier_counts: TierCounts | null
  updated_at: string
}

export const progressKey = (characterId: string | null, taskId: string) => `${characterId ?? 'account'}:${taskId}`

/** Total entries for a task: the sum of its tiers when it has them, else max_entries. */
export const taskMax = (task: Task) =>
  task.tiers?.length ? task.tiers.reduce((sum, t) => sum + t.max, 0) : task.max_entries

/** Sum of tier counts, each capped at its tier's max. */
export const tierTotal = (tiers: Tier[], counts: TierCounts) =>
  tiers.reduce((sum, t) => sum + Math.min(counts[t.key] ?? 0, t.max), 0)
