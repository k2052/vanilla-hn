import { describe, expect, it } from 'vitest'
import getComments from '../../../src/universal/lib/getComments'
import { createMemoryApi } from '../../../src/universal/lib/hnApi'

describe('getComments', () => {
  const fakeApi = createMemoryApi({
    'item/1': {
      id: 1,
      by: 'user1',
      text: 'Top level comment',
      time: 1600000000,
      descendants: 2,
      kids: [2, 3],
    },
    'item/2': {
      id: 2,
      by: 'user2',
      text: 'Child comment 1',
      time: 1600000010,
      descendants: 1,
      kids: [4],
    },
    'item/3': {
      id: 3,
      deleted: true,
      time: 1600000020,
    },
    'item/4': {
      id: 4,
      by: 'user4',
      text: 'Deep grandchild',
      time: 1600000030,
      kids: [5],
    },
    'item/5': {
      id: 5,
      by: 'user5',
      text: 'Too deep',
      time: 1600000040,
    },
  })

  it('hydrates nested comment threads preserving tree structure and ignoring deleted comments', async () => {
    const comments = await getComments([1], { api: fakeApi, maxDepth: 5 })
    expect(comments).toHaveLength(1)
    expect(comments[0].id).toBe(1)
    expect(comments[0].user).toBe('user1')
    expect(comments[0].comments).toHaveLength(1) // only 2 is active, 3 is deleted
    expect(comments[0].comments[0].id).toBe(2)
    expect(comments[0].comments[0].comments).toHaveLength(1)
    expect(comments[0].comments[0].comments[0].id).toBe(4)
  })

  it('bounds recursion strictly using maxDepth', async () => {
    // With maxDepth=2, depth 0 is id:1, depth 1 is id:2, but id:2 kids (depth 2) are not traversed
    const comments = await getComments([1], { api: fakeApi, maxDepth: 2 })
    expect(comments).toHaveLength(1)
    expect(comments[0].comments).toHaveLength(1)
    expect(comments[0].comments[0].comments).toEqual([])
  })

  it('returns empty array when input ids is empty, null, or maxDepth <= 0', async () => {
    expect(await getComments([], { api: fakeApi })).toEqual([])
    expect(await getComments(null, { api: fakeApi })).toEqual([])
    expect(await getComments([1], { api: fakeApi, maxDepth: 0 })).toEqual([])
  })
})
