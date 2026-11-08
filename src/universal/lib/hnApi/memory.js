/**
 * In-memory mock adapter for tests.
 */
export const createMemoryApi = (initialData = {}) => {
  const data = new Map(Object.entries(initialData))
  const listeners = new Map()

  const once = async (path) => {
    return data.has(path) ? structuredClone(data.get(path)) : null
  }

  const on = (path, cb) => {
    if (!listeners.has(path)) {
      listeners.set(path, new Set())
    }
    listeners.get(path).add(cb)
    if (data.has(path)) {
      cb(structuredClone(data.get(path)))
    }
    return { path, cb }
  }

  const off = (handle) => {
    if (typeof handle === 'function') {
      handle()
    } else if (handle?.path && handle.cb) {
      listeners.get(handle.path)?.delete(handle.cb)
    }
  }

  const subscribe = (path, cb) => {
    const handle = on(path, cb)
    return () => off(handle)
  }

  const set = (path, val) => {
    data.set(path, val)
    listeners.get(path)?.forEach((cb) => {
      cb(structuredClone(val))
    })
  }

  return {
    once,
    on,
    off,
    subscribe,
    set,
    data,
  }
}

export default createMemoryApi
