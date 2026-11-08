import { describe, expect, it } from 'vitest'
import sagas from '../../../src/client/sagas'
import toggleComment from '../../../src/client/sagas/toggleComment'
import { TOGGLE_COMMENT } from '../../../src/universal/events/types'

describe('toggleComment saga', () => {
  it('exports sagas array containing routeChange and toggleComment', () => {
    expect(sagas).toHaveLength(2)
  })

  it('triggers setState and toggleComment effect on TOGGLE_COMMENT event', async () => {
    const action = {
      type: TOGGLE_COMMENT,
      payload: { id: 10 },
    }
    const store = {
      state: {
        toggledComments: { 10: false },
      },
    }

    const gen = toggleComment(action, store)

    const step1 = await gen.next()
    expect(step1.value.meta).toEqual({
      type: 'SET_STATE',
      path: 'toggledComments',
      state: { 10: true },
    })

    const step2 = await gen.next()
    expect(step2.value.meta).toEqual({
      type: 'TOGGLE_COMMENT',
    })

    const step3 = await gen.next()
    expect(step3.done).toBe(true)
  })

  it('ignores non-matching action types and returns immediately', async () => {
    const action = { type: 'SOME_OTHER_ACTION', payload: {} }
    const gen = toggleComment(action, { state: {} })
    const step = await gen.next()
    expect(step.done).toBe(true)
    expect(step.value).toBeUndefined()
  })
})
