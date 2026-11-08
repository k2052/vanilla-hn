import { describe, expect, it } from 'vitest'
import { setState } from '../../../src/universal/effects'

describe('setState effect', () => {
  it('updates store state at specified path and has correct meta', async () => {
    const store = {
      state: {
        existing: true,
        count: 0,
      },
    }

    const effect = setState('count', 5)
    expect(effect.meta).toEqual({
      type: 'SET_STATE',
      path: 'count',
      state: 5,
    })

    const result = await effect(store)
    expect(result.state.count).toBe(5)
    expect(result.state.existing).toBe(true)
  })
})
