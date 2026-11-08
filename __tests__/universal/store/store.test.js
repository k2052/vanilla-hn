import { describe, expect, it, vi } from 'vitest'
import { EFFECT_ERROR } from '../../../src/universal/events/types'
import Store from '../../../src/universal/store'

describe('Store', () => {
  it('dispatches actions to sagas in order and notifies listeners', async () => {
    const order = []

    async function* saga1(action) {
      if (action.type === 'TEST') {
        order.push('saga1')
        yield async (store) => {
          store.state.saga1Done = true
        }
      }
    }

    async function* saga2(action) {
      if (action.type === 'TEST') {
        order.push('saga2')
        yield async (store) => {
          store.state.saga2Done = true
        }
      }
    }

    const store = new Store([saga1, saga2], { initial: true })
    const listener = vi.fn()
    store.addListener(listener)

    await store.dispatch({ type: 'TEST' })

    expect(order).toEqual(['saga1', 'saga2'])
    expect(store.state.saga1Done).toBe(true)
    expect(store.state.saga2Done).toBe(true)
    expect(listener).toHaveBeenCalledWith({ type: 'TEST' })
  })

  it('isolates saga errors so one failing saga does not prevent others from running', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    async function* failingSaga() {
      yield async () => {}
      throw new Error('Saga exploded')
    }

    let nextSagaRan = false
    async function* passingSaga() {
      yield async () => {}
      nextSagaRan = true
    }

    const store = new Store([failingSaga, passingSaga])
    await store.dispatch({ type: 'ANY' })

    expect(nextSagaRan).toBe(true)
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('catches effect errors, logs them, and dispatches EFFECT_ERROR event', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const dispatchedActions = []

    const store = new Store([])
    store.addListener((action) => dispatchedActions.push(action))

    const failingEffect = async () => {
      throw new Error('Effect failed')
    }
    failingEffect.meta = { type: 'FAILING_EFFECT' }

    await store.runEffect(failingEffect)

    expect(consoleSpy).toHaveBeenCalled()
    const errorAction = dispatchedActions.find((a) => a.type === EFFECT_ERROR)
    expect(errorAction).toBeDefined()
    expect(errorAction.payload.meta.type).toBe('FAILING_EFFECT')
    expect(errorAction.payload.error.message).toBe('Effect failed')

    consoleSpy.mockRestore()
  })

  it('allows dynamically adding sagas via addHandler', async () => {
    const store = new Store([])
    let ran = false
    store.addHandler(async function* () {
      yield async () => {}
      ran = true
    })
    await store.dispatch({ type: 'TEST' })
    expect(ran).toBe(true)
  })
})
