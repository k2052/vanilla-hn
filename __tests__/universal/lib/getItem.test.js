import { describe, expect, it, vi } from 'vitest'
import getItem, { observe, transform } from '../../../src/universal/lib/getItem'
import { createMemoryApi } from '../../../src/universal/lib/hnApi'

describe('getItem', () => {
  const fakeApi = createMemoryApi({
    'item/42': {
      id: 42,
      by: 'norvig',
      descendants: 10,
      kids: [100, 101],
      score: 150,
      time: 1500000000,
      title: 'Teach Yourself Programming',
      url: 'http://norvig.com/21-days.html',
    },
  })

  it('fetches and transforms an item correctly', async () => {
    const item = await getItem(42, { api: fakeApi })
    expect(item).not.toBeNull()
    expect(item.id).toBe(42)
    expect(item.user).toBe('norvig')
    expect(item.score).toBe(150)
    expect(item.commentsCount).toBe(10)
    expect(item.comments).toEqual([100, 101])
    expect(item.date).toBeInstanceOf(Date)
  })

  it('returns null when item is missing', async () => {
    const item = await getItem(9999, { api: fakeApi })
    expect(item).toBeNull()
  })

  it('transform handles null and missing optional fields', () => {
    expect(transform(null)).toBeNull()
    const minimal = transform({ id: 1 })
    expect(minimal.id).toBe(1)
    expect(minimal.comments).toEqual([])
    expect(minimal.commentsCount).toBe(0)
    expect(minimal.score).toBe(0)
    expect(minimal.title).toBe('')
  })

  it('observe subscribes to item changes and unsubscribes', () => {
    const callback = vi.fn()
    const handle = observe(42, callback, { api: fakeApi })
    expect(callback).toHaveBeenCalled()

    fakeApi.set('item/42', {
      id: 42,
      by: 'norvig',
      score: 200,
      time: 1500000000,
      title: 'Updated title',
    })
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ score: 200, title: 'Updated title' }),
    )

    fakeApi.off(handle)
  })
})
