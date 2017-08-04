import root from 'window-or-global'
import get from 'lodash.get'

const dispatch = (action) => {
  root.store.dispatch(action)
}

/**
 * A wrapper function we don't have to access the window.store global in components
 */
const wrap = (paths, component) => {
  const wrapped = (state) => {
    const finalState = { ...state, dispatch }
    Object.keys(paths).forEach((k) => {
      const path = paths[k]
      finalState[k] = get(root.store.state, path)
    })

    return component(finalState)
  }

  return wrapped
}

export default wrap
