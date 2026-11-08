import { effectError } from '../events'
import { EFFECT_ERROR } from '../events/types'

/**
 * @typedef {object} Action
 * @property {string} type - Action type identifier.
 * @property {any} [payload] - Optional action payload.
 */

/**
 * Plain JS state store using sagas (async generators) and effects.
 */
class Store {
  /**
   * @param {Array<Function>} [sagas=[]]
   * @param {Record<string, any>} [initialState={}]
   */
  constructor(sagas = [], initialState = {}) {
    this.state = initialState
    this.sagas = sagas
    this.listeners = []
  }

  /**
   * Register an additional saga handler.
   * @param {Function} handler
   */
  addHandler(handler) {
    this.sagas.push(handler)
  }

  /**
   * Register a state/action listener.
   * @param {(action: Action) => void} listener
   */
  addListener(listener) {
    this.listeners.push(listener)
  }

  /**
   * Execute an effect against this store.
   * Dispatches EFFECT_ERROR if the effect throws.
   * @param {Function} effect
   */
  async runEffect(effect) {
    try {
      await effect(this)
    } catch (e) {
      console.error(e)
      if (effect?.meta?.type !== EFFECT_ERROR) {
        await this.dispatch(effectError({ meta: effect?.meta, error: e }))
      }
    }
  }

  /**
   * Dispatch an action to all registered sagas and listeners.
   * @param {Action} action
   * @returns {Promise<boolean>}
   */
  async dispatch(action) {
    for (let i = 0; i < this.sagas.length; i += 1) {
      const handler = this.sagas[i]
      try {
        for await (const effect of handler(action, this)) {
          await this.runEffect(effect)
        }
      } catch (err) {
        console.error('Error running saga:', err)
      }
    }

    for (let i = 0; i < this.listeners.length; i += 1) {
      const listener = this.listeners[i]
      try {
        listener(action)
      } catch (err) {
        console.error('Error running listener:', err)
      }
    }

    return true
  }
}

export default Store
