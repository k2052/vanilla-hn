import { on, once } from './db'

/**
 * @typedef {object} HNItem
 * @property {number} id
 * @property {string} [url]
 * @property {string} [user]
 * @property {Date} date
 * @property {number[]} comments
 * @property {number} commentsCount
 * @property {number} score
 * @property {string} title
 */

/**
 * Normalise raw Firebase item object into consistent HNItem shape.
 * @param {any} val
 * @returns {HNItem | null}
 */
const transform = (val) => {
  if (!val) return null
  return {
    id: val.id,
    url: val.url,
    user: val.by,
    // time is seconds since epoch, not ms
    date: val.time ? new Date(val.time * 1000) : new Date(),
    // sometimes `kids` is `undefined`
    comments: val.kids || [],
    commentsCount: val.descendants ?? (val.kids ? val.kids.length : 0),
    score: val.score || 0,
    title: val.title || '',
  }
}

/**
 * Observe realtime updates to an HN item.
 * @param {number | string} id
 * @param {(item: HNItem) => void} fn
 * @param {object} [options]
 * @param {any} [options.api]
 * @returns {any} Unsubscribe handle
 */
const observe = (id, fn, { api } = {}) =>
  on(
    `item/${id}`,
    (val) => {
      if (val) fn(transform(val))
    },
    { api },
  )

/**
 * Fetch a single HN item by ID.
 * @param {number | string} id
 * @param {object} [options]
 * @param {any} [options.api]
 * @returns {Promise<HNItem | null>}
 */
const getItem = async (id, { api } = {}) => {
  const val = await once(`item/${id}`, { api })
  if (val) {
    return transform(val)
  }
  return null
}

export default getItem
export { observe, transform }
