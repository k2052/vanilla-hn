import get from 'lodash.get'
import root from 'window-or-global'

/**
 * Dispatch an action using the global store if present.
 * @param {object} action
 */
const dispatch = (action) => {
  root.store?.dispatch?.(action)
}

/**
 * Higher-order component to map store state slices to component props.
 *
 * @param {Record<string, string>} [paths={}] - Map of prop name to state path (e.g. { toggledComments: 'toggledComments' }).
 * @param {(props: any) => string} component - Component function returning HTML string.
 * @returns {(props?: any) => string} Wrapped component.
 */
const wrap = (paths = {}, component) => {
  const wrapped = (state = {}) => {
    const finalState = { dispatch, ...state }
    if (root.store?.state) {
      Object.keys(paths).forEach((k) => {
        const path = paths[k]
        if (state[k] === undefined) {
          finalState[k] = get(root.store.state, path)
        }
      })
    }

    return component(finalState)
  }

  return wrapped
}

export default wrap
