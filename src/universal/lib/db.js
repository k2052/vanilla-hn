import { getApi } from './hnApi'
import defaultApi, { database } from './hnApi/firebase'

export const once = (path, options) => {
  const api = options?.api || getApi?.() || defaultApi
  return api.once(path)
}

export const on = (path, cb, options) => {
  const api = options?.api || getApi?.() || defaultApi
  return api.on(path, cb)
}

export const off = (handle, options) => {
  const api = options?.api || getApi?.() || defaultApi
  return api.off(handle)
}

export const subscribe = (path, cb, options) => {
  const api = options?.api || getApi?.() || defaultApi
  return api.subscribe(path, cb)
}

export { database }
export default defaultApi
