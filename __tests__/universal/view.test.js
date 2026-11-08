import { describe, expect, it } from 'vitest'
import { createMemoryApi } from '../../src/universal/lib/hnApi'
import view from '../../src/universal/view'

describe('view', () => {
  const fakeApi = createMemoryApi({
    topstories: [1],
    'item/1': {
      id: 1,
      title: 'View Test Story',
      by: 'tester',
      score: 50,
      time: 1600000000,
      kids: [],
    },
  })

  it('renders HTML string for a given state.path', async () => {
    const state = {
      path: '/news',
      query: { page: 1 },
      api: fakeApi,
    }

    const html = await view(state)
    expect(typeof html).toBe('string')
    expect(html).toContain('View Test Story')
  })
})
