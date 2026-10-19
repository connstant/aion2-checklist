import { describe, expect, it } from 'vitest'
import { currentPeriodStart, formatCountdown, isInCurrentPeriod, nextReset } from './resets'

const d = (iso: string) => new Date(iso)

describe('daily reset', () => {
  it('uses today 07:00 UTC once it has passed', () => {
    expect(currentPeriodStart('daily', d('2026-10-19T07:00:00Z')).toISOString()).toBe('2026-10-19T07:00:00.000Z')
    expect(currentPeriodStart('daily', d('2026-10-19T23:59:00Z')).toISOString()).toBe('2026-10-19T07:00:00.000Z')
  })

  it('uses yesterday 07:00 UTC before today’s reset', () => {
    expect(currentPeriodStart('daily', d('2026-10-19T06:59:59Z')).toISOString()).toBe('2026-10-18T07:00:00.000Z')
  })

  it('crosses month boundaries', () => {
    expect(currentPeriodStart('daily', d('2026-11-01T03:00:00Z')).toISOString()).toBe('2026-10-31T07:00:00.000Z')
  })

  it('next reset is 24h later', () => {
    expect(nextReset('daily', d('2026-10-19T06:00:00Z')).toISOString()).toBe('2026-10-19T07:00:00.000Z')
  })
})

describe('weekly reset (Wednesday 07:00 UTC)', () => {
  // 2026-10-21 is a Wednesday
  it('Wednesday after reset starts a new week', () => {
    expect(currentPeriodStart('weekly', d('2026-10-21T07:00:00Z')).toISOString()).toBe('2026-10-21T07:00:00.000Z')
  })

  it('Wednesday before reset is still the previous week', () => {
    expect(currentPeriodStart('weekly', d('2026-10-21T06:59:00Z')).toISOString()).toBe('2026-10-14T07:00:00.000Z')
  })

  it('Tuesday belongs to the week that started last Wednesday', () => {
    expect(currentPeriodStart('weekly', d('2026-10-20T12:00:00Z')).toISOString()).toBe('2026-10-14T07:00:00.000Z')
    expect(nextReset('weekly', d('2026-10-20T12:00:00Z')).toISOString()).toBe('2026-10-21T07:00:00.000Z')
  })
})

describe('isInCurrentPeriod', () => {
  it('clears a daily check after reset', () => {
    const checkedAt = '2026-10-19T20:00:00Z'
    expect(isInCurrentPeriod(checkedAt, 'daily', d('2026-10-20T06:59:00Z'))).toBe(true)
    expect(isInCurrentPeriod(checkedAt, 'daily', d('2026-10-20T07:00:00Z'))).toBe(false)
  })

  it('keeps a weekly check through Tuesday, clears on Wednesday', () => {
    const checkedAt = '2026-10-15T10:00:00Z'
    expect(isInCurrentPeriod(checkedAt, 'weekly', d('2026-10-20T23:00:00Z'))).toBe(true)
    expect(isInCurrentPeriod(checkedAt, 'weekly', d('2026-10-21T07:00:00Z'))).toBe(false)
  })
})

describe('formatCountdown', () => {
  it('formats days, hours and minutes', () => {
    expect(formatCountdown(((2 * 24 + 5) * 60 + 30) * 60000)).toBe('2d 5h')
    expect(formatCountdown((3 * 60 + 7) * 60000)).toBe('3h 7m')
    expect(formatCountdown(45 * 60000)).toBe('45m')
    expect(formatCountdown(-5)).toBe('0m')
  })
})
