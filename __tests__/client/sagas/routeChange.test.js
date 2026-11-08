import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import routeChange from '../../../src/client/sagas/routeChange'
import { ROUTE_CHANGE } from '../../../src/universal/events/types'

describe('routeChange saga', () => {
  beforeEach(() => {
    global.window = {
      basepath: '/',
    }
    global.history = {
      pushState: () => {},
    }
  })

  afterEach(() => {
    delete global.window
    delete global.history
  })

  it('sets the path, query, and triggers renderApp', async () => {
    const url = '/cats?cats=awesome'
    const action = {
      type: ROUTE_CHANGE,
      payload: { url },
    }
    const gen = routeChange(action, { state: { history: {} } })

    const step1 = await gen.next()
    expect(step1.value.meta).toEqual({
      type: 'SET_STATE',
      path: 'path',
      state: url,
    })

    const step2 = await gen.next()
    expect(step2.value.meta).toEqual({
      type: 'SET_STATE',
      path: 'query',
      state: { cats: 'awesome' },
    })

    const step3 = await gen.next()
    expect(step3.value.meta).toEqual({
      type: 'RENDER_APP',
    })
  })

  it('handles custom basepath when basepath !== "/"', async () => {
    global.window.basepath = '/subapp/'
    let pushedUrl = ''
    global.history.pushState = (_, __, url) => {
      pushedUrl = url
    }

    const action = {
      type: ROUTE_CHANGE,
      payload: { url: '/news?page=2' },
    }
    const gen = routeChange(action, { state: { history: {} } })
    await gen.next()
    expect(pushedUrl).toBe('/subapp/news?page=2')
  })

  it('ignores non-matching action types and returns immediately', async () => {
    const action = { type: 'OTHER_ACTION', payload: {} }
    const gen = routeChange(action, { state: {} })
    const step = await gen.next()
    expect(step.done).toBe(true)
    expect(step.value).toBeUndefined()
  })
})
