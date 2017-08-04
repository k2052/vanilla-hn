/**
 * @jest-environment node
 */
import { TOGGLE_COMMENT } from '../../../src/universal/events/types'
import toggleComment from '../../../src/client/sagas/toggleComment'

test('it should trigger a toggleComment effect', async () => {
  const action = {
    type: TOGGLE_COMMENT,
    payload: {
      id: 1,
    },
  }
  const gen = toggleComment(action, {
    state: { toggledComments: {} },
  })

  let nxt = await gen.next()
  let { meta } = nxt.value
  expect(meta.type).toBe('SET_STATE')

  nxt = await gen.next()
  meta = nxt.value.meta
  expect(meta.type).toBe('TOGGLE_COMMENT')
})
