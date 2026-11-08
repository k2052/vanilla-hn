import { describe, expect, it } from 'vitest'
import {
  effectError,
  renderApp,
  routeChange,
  toggleComment,
} from '../../../src/universal/events'
import {
  EFFECT_ERROR,
  RENDER_APP,
  ROUTE_CHANGE,
  TOGGLE_COMMENT,
} from '../../../src/universal/events/types'

describe('Events and Action Creators', () => {
  it('creates unique action types', () => {
    const types = [ROUTE_CHANGE, TOGGLE_COMMENT, RENDER_APP, EFFECT_ERROR]
    expect(new Set(types).size).toBe(4)
  })

  it('creates routeChange action object', () => {
    const action = routeChange('/test')
    expect(action).toEqual({
      type: ROUTE_CHANGE,
      payload: { url: '/test' },
    })
  })

  it('creates toggleComment action object', () => {
    const action = toggleComment({ id: 123 })
    expect(action).toEqual({
      type: TOGGLE_COMMENT,
      payload: { id: 123 },
    })
  })

  it('creates renderApp action object', () => {
    const action = renderApp()
    expect(action).toEqual({ type: RENDER_APP })
  })

  it('creates effectError action object', () => {
    const err = new Error('boom')
    const action = effectError({ meta: { type: 'TEST' }, error: err })
    expect(action).toEqual({
      type: EFFECT_ERROR,
      payload: { meta: { type: 'TEST' }, error: err },
    })
  })
})
