import { RESET_HOUR_UTC, WEEKLY_RESET_DAY_UTC } from '../config/region'

export type Cadence = 'daily' | 'weekly'

const DAY_MS = 24 * 60 * 60 * 1000

/** Start of the reset period that `now` falls in. */
export function currentPeriodStart(cadence: Cadence, now: Date = new Date()): Date {
  let start = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), RESET_HOUR_UTC)
  if (start > now.getTime()) start -= DAY_MS
  if (cadence === 'weekly') {
    while (new Date(start).getUTCDay() !== WEEKLY_RESET_DAY_UTC) start -= DAY_MS
  }
  return new Date(start)
}

export function nextReset(cadence: Cadence, now: Date = new Date()): Date {
  const start = currentPeriodStart(cadence, now).getTime()
  return new Date(start + (cadence === 'weekly' ? 7 : 1) * DAY_MS)
}

/** True if a timestamp falls inside the current reset period (i.e. hasn't been reset yet). */
export function isInCurrentPeriod(timestamp: string | Date, cadence: Cadence, now: Date = new Date()): boolean {
  return new Date(timestamp).getTime() >= currentPeriodStart(cadence, now).getTime()
}

export function formatCountdown(ms: number): string {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000))
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}
