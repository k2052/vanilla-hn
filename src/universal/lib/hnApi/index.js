import firebaseApi from './firebase'
import { createMemoryApi } from './memory'
import restApi, { createRestApi } from './rest'

/**
 * @typedef {object} HnApi
 * @property {(path: string) => Promise<any>} once
 * @property {(path: string, cb: (val: any) => void) => any} on
 * @property {(handle: any) => void} off
 * @property {(path: string, cb: (val: any) => void) => () => void} subscribe
 */

let defaultApi = firebaseApi

/**
 * Get the currently active HN API adapter.
 * @returns {HnApi}
 */
export const getApi = () => defaultApi

/**
 * Set the active HN API adapter.
 * @param {HnApi} api
 */
export const setApi = (api) => {
  defaultApi = api
}

/**
 * Reset the active HN API adapter to the default Firebase adapter.
 */
export const resetApi = () => {
  defaultApi = firebaseApi
}

export { createMemoryApi, createRestApi, firebaseApi, restApi }
export default firebaseApi
