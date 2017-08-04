/**
 * @jest-environment node
 */
import { ROUTE_CHANGE } from '../../../src/universal/events/types'
import routeChange from '../../../src/client/sagas/routeChange'

test('it should set the path, qery, and re-render the app', async () => {
  const url = '/cats?cats=awesome'

  const action = {
    type: ROUTE_CHANGE,
    payload: {
      url,
    },
  }
  const gen = routeChange(action, {
    state: { history: {} },
  })

  // It should set the path
  let nxt = await gen.next()
  let { meta } = nxt.value
  let { path, state } = meta
  expect(meta.type).toBe('SET_STATE')
  expect(path).toBe('path')
  expect(state).toEqual(url)

  // It should set the query
  nxt = await gen.next()
  meta = nxt.value.meta
  path = meta.path
  state = meta.state
  expect(meta.type).toBe('SET_STATE')
  expect(path).toBe('query')
  expect(Object.keys(state).sort()).toEqual(['cats'].sort())
  expect(state.cats).toEqual('awesome')

  // It should re-render the app
  nxt = await gen.next()
  meta = nxt.value.meta
  expect(meta.type).toBe('RENDER_APP')
})
