import { EFFECT_ERROR, RENDER_APP, ROUTE_CHANGE, TOGGLE_COMMENT } from './types'

const routeChange = (url) => ({
  type: ROUTE_CHANGE,
  payload: {
    url,
  },
})

const toggleComment = (comment) => ({
  type: TOGGLE_COMMENT,
  payload: comment,
})

const renderApp = () => ({
  type: RENDER_APP,
})

const effectError = ({ meta, error }) => ({
  type: EFFECT_ERROR,
  payload: {
    meta,
    error,
  },
})

export { effectError, renderApp, routeChange, toggleComment }
