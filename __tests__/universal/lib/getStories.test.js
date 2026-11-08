import { describe, expect, it } from 'vitest'
import getStories from '../../../src/universal/lib/getStories'
import { createMemoryApi } from '../../../src/universal/lib/hnApi'

describe('getStories', () => {
  const ids = Array.from({ length: 100 }, (_, i) => i + 1)
  const initialData = {
    topstories: ids,
  }
  for (const id of ids) {
    initialData[`item/${id}`] = {
      id,
      title: `Story ${id}`,
      by: `author${id}`,
      score: id * 2,
      time: 1600000000 + id,
      descendants: id,
      kids: [],
      url: `https://example.com/${id}`,
    }
  }

  const fakeApi = createMemoryApi(initialData)

  it('fetches exact page size (30 items by default) without off-by-one truncation', async () => {
    const stories = await getStories('topstories', {
      page: 1,
      max: 30,
      api: fakeApi,
    })
    expect(stories).toHaveLength(30)
    expect(stories[0].id).toBe(1)
    expect(stories[29].id).toBe(30)
  })

  it('paginates correctly for page 2', async () => {
    const stories = await getStories('topstories', {
      page: 2,
      max: 30,
      api: fakeApi,
    })
    expect(stories).toHaveLength(30)
    expect(stories[0].id).toBe(31)
    expect(stories[29].id).toBe(60)
  })

  it('clamps invalid or <1 pages to 1', async () => {
    const stories = await getStories('topstories', {
      page: -5,
      max: 10,
      api: fakeApi,
    })
    expect(stories).toHaveLength(10)
    expect(stories[0].id).toBe(1)
  })

  it('returns empty array when page is beyond total items', async () => {
    const stories = await getStories('topstories', {
      page: 10,
      max: 30,
      api: fakeApi,
    })
    expect(stories).toEqual([])
  })

  it('handles null/empty story lists gracefully', async () => {
    const emptyApi = createMemoryApi({})
    const stories = await getStories('nonexistent', { api: emptyApi })
    expect(stories).toEqual([])
  })
})
