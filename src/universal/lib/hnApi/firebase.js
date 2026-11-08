import { getApps, initializeApp } from 'firebase/app'
import { off as fbOff, get, getDatabase, onValue, ref } from 'firebase/database'

let app
try {
  app = initializeApp({ databaseURL: 'https://hacker-news.firebaseio.com' })
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)
  }
  app = getApps()[0]
}

const database = getDatabase(app)

/**
 * Read a value once from HN Firebase DB relative to `v0`.
 * @param {string} path
 * @returns {Promise<any>}
 */
export const once = async (path) => {
  const snap = await get(ref(database, `v0/${path}`))
  return snap.val()
}

/**
 * Subscribe to value changes at `v0/<path>`.
 * @param {string} path
 * @param {(val: any) => void} cb
 * @returns {{ ref: any, handler: any }}
 */
export const on = (path, cb) => {
  const r = ref(database, `v0/${path}`)
  const handler = (snap) => cb(snap.val())
  onValue(r, handler)
  return { ref: r, handler }
}

/**
 * Unsubscribe a previously registered listener.
 * @param {Function | { ref: any, handler: any }} handle
 */
export const off = (handle) => {
  if (typeof handle === 'function') {
    handle()
  } else if (handle?.ref && handle.handler) {
    fbOff(handle.ref, 'value', handle.handler)
  }
}

/**
 * Convenience helper returning an unsubscribe function.
 * @param {string} path
 * @param {(val: any) => void} cb
 * @returns {() => void}
 */
export const subscribe = (path, cb) => {
  const handle = on(path, cb)
  return () => off(handle)
}

const firebaseApi = {
  once,
  on,
  off,
  subscribe,
  database,
}

export { database }
export default firebaseApi
