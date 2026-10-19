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
}

export interface TaskProgress {
  id: string
  user_id: string
  character_id: string | null
  task_id: string
  count: number
  updated_at: string
}

export const progressKey = (characterId: string | null, taskId: string) => `${characterId ?? 'account'}:${taskId}`
