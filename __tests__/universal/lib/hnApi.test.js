import { describe, expect, it, vi } from 'vitest'
import db, { off, on, once, subscribe } from '../../../src/universal/lib/db'
import defaultApi, {
  createMemoryApi,
  createRestApi,
  getApi,
  resetApi,
  setApi,
} from '../../../src/universal/lib/hnApi'

describe('hnApi adapters', () => {
  it('createMemoryApi handles once, set, on, off, and subscribe', async () => {
    const memory = createMemoryApi({ 'item/1': { id: 1, title: 'Item 1' } })
    expect(await memory.once('item/1')).toEqual({ id: 1, title: 'Item 1' })
    expect(await memory.once('nonexistent')).toBeNull()

    const listener = vi.fn()
    const handle = memory.on('item/1', listener)
    expect(listener).toHaveBeenCalledWith({ id: 1, title: 'Item 1' })

    memory.set('item/1', { id: 1, title: 'Updated' })
    expect(listener).toHaveBeenCalledWith({ id: 1, title: 'Updated' })

    memory.off(handle)
    memory.set('item/1', { id: 1, title: 'Ignored' })
    expect(listener).toHaveBeenCalledTimes(2)

    const unsub = memory.subscribe('item/1', listener)
    unsub()
  })

  it('createRestApi fetches from the given endpoint and handles subscribe/off', async () => {
    const fakeFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 99, by: 'test' }),
    })

    const rest = createRestApi({
      fetchFn: fakeFetch,
      baseUrl: 'https://test-hn.com/v0',
    })
    const data = await rest.once('item/99')
    expect(fakeFetch).toHaveBeenCalledWith(
      'https://test-hn.com/v0/item/99.json',
    )
    expect(data).toEqual({ id: 99, by: 'test' })

    const listener = vi.fn()
    const unsub = rest.subscribe('item/99', listener)
    expect(typeof unsub).toBe('function')
    unsub()
    rest.off(unsub)
  })

  it('createRestApi throws when response is not ok', async () => {
    const errorFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    const rest = createRestApi({ fetchFn: errorFetch })
    await expect(rest.once('item/404')).rejects.toThrow(
      'HN REST API error: 404 Not Found',
    )
  })

  it('getApi, setApi, and resetApi manage the active adapter', () => {
    expect(getApi()).toBe(defaultApi)
    const customApi = createMemoryApi()
    setApi(customApi)
    expect(getApi()).toBe(customApi)
    resetApi()
    expect(getApi()).toBe(defaultApi)
  })

  it('firebaseApi off handles function and null/empty shapes safely', () => {
    const fn = vi.fn()
    defaultApi.off(fn)
    expect(fn).toHaveBeenCalled()

    defaultApi.off(null)
    defaultApi.off({})
  })

  it('lib/db.js functions delegate to options.api or active api', async () => {
    const mock = createMemoryApi({ testpath: 'hello' })
    expect(await once('testpath', { api: mock })).toBe('hello')

    const cb = vi.fn()
    const handle = on('testpath', cb, { api: mock })
    expect(cb).toHaveBeenCalledWith('hello')
    off(handle, { api: mock })
    subscribe('testpath', cb, { api: mock })()
    expect(db).toBeDefined()
  })
})
