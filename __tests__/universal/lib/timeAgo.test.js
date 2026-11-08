import { describe, expect, it } from 'vitest'
import timeAgo from '../../../src/universal/lib/timeAgo'

describe('timeAgo', () => {
  it('formats seconds correctly', () => {
    const date = new Date(Date.now() - 30 * 1000)
    expect(timeAgo(date)).toBe('30 seconds')
  })

  it('formats minutes correctly', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000)
    expect(timeAgo(date)).toBe('5 minutes')
  })

  it('formats hours correctly', () => {
    const date = new Date(Date.now() - 3 * 3600 * 1000)
    expect(timeAgo(date)).toBe('3 hours')
  })

  it('formats days correctly', () => {
    const date = new Date(Date.now() - 2 * 86400 * 1000)
    expect(timeAgo(date)).toBe('2 days')
  })

  it('handles very recent diff (<1s)', () => {
    const date = new Date(Date.now() - 200)
    const result = timeAgo(date)
    expect(result).toMatch(/(milliseconds|seconds)/)
  })

  it('handles timestamp number input', () => {
    const ts = Date.now() - 60 * 1000
    expect(timeAgo(ts)).toBe('1 minutes')
  })

  it('handles future or zero diff gracefully', () => {
    const future = new Date(Date.now() + 10000)
    expect(timeAgo(future)).toBe('0 milliseconds')
  })
})
