import { once } from './db'

/**
 * Hydrate comments based on an array of item ids using an explicit stack
 * to prevent deep recursion.
 *
 * @param {number[]} ids
 * @param {object} [options]
 * @param {number} [options.maxDepth=10]
 * @param {object} [options.api]
 * @returns {Promise<Array>}
 */
const getComments = async (ids = [], { maxDepth = 10, api } = {}) => {
  if (!ids?.length || maxDepth <= 0) return []

  const rootComments = []
  const stack = ids.map((id, index) => ({
    id,
    depth: 0,
    parentArray: rootComments,
    index,
  }))

  while (stack.length > 0) {
    const itemTask = stack.pop()
    const { id, depth, parentArray, index } = itemTask
    if (depth >= maxDepth) continue

    try {
      const val = await once(`item/${id}`, { api })
      if (!val || val.deleted || val.dead) continue

      const commentObj = {
        id: val.id,
        user: val.by || '',
        text: val.text || '',
        date: val.time ? new Date(val.time * 1000) : new Date(),
        comments: [],
        commentsCount: val.descendants ?? (val.kids ? val.kids.length : 0),
      }
      parentArray[index] = commentObj

      if (val.kids?.length && depth + 1 < maxDepth) {
        for (let i = val.kids.length - 1; i >= 0; i -= 1) {
          stack.push({
            id: val.kids[i],
            depth: depth + 1,
            parentArray: commentObj.comments,
            index: i,
          })
        }
      }
    } catch {
      // Ignore individual fetch errors
    }
  }

  const compact = (arr) => {
    const res = []
    for (const item of arr) {
      if (item) {
        if (item.comments?.length) {
          item.comments = compact(item.comments)
        }
        res.push(item)
      }
    }
    return res
  }

  return compact(rootComments)
}

export default getComments
