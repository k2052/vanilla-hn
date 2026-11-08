/**
 * Creates an effect that updates a property on the store state.
 *
 * @param {string} path - State property key to update.
 * @param {any} state - Value to set at that path.
 * @returns {Function} An async effect function with metadata.
 */
const setState = (path, state) => {
  const setter = async (store) => {
    store.state[path] = state
    return store
  }

  setter.meta = {
    path,
    state,
    type: 'SET_STATE',
  }

  return setter
}

export { setState }
export default setState
