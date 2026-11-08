/**
 * REST adapter using Hacker News Firebase REST API (https://hacker-news.firebaseio.com/v0/{path}.json)
 */
export const createRestApi = ({
  baseUrl = 'https://hacker-news.firebaseio.com/v0',
  fetchFn = globalThis.fetch,
} = {}) => {
  const once = async (path) => {
    const res = await fetchFn(`${baseUrl}/${path}.json`)
    if (!res.ok) {
      throw new Error(`HN REST API error: ${res.status} ${res.statusText}`)
    }
    return res.json()
  }

  const on = (path, cb) => {
    let active = true
    once(path)
      .then((val) => {
        if (active) cb(val)
      })
      .catch((err) => {
        console.error(`Error in restApi.on(${path}):`, err)
      })
    return () => {
      active = false
    }
  }

  const off = (handle) => {
    if (typeof handle === 'function') {
      handle()
    }
  }

  const subscribe = (path, cb) => {
    const handle = on(path, cb)
    return () => off(handle)
  }

  return {
    once,
    on,
    off,
    subscribe,
  }
}

const restApi = createRestApi()
export default restApi
