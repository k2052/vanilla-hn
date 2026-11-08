import URL from 'url-parse'
import { setState } from '../../universal/effects'
import { ROUTE_CHANGE } from '../../universal/events/types'
import { renderApp } from '../effects'

/**
 * Handles route changes;
 * 1. Takes the new url and pushes it onto the history object
 * 2. Sets the path state in the store to the new url pathname
 * 3. Sets the query state to the parsed query object
 * 4. Triggers a re-render of the app
 */
async function* routeChange(action, store) {
  if (action.type !== ROUTE_CHANGE) {
    return
  }

  const { url } = action.payload
  const parsedUrl = new URL(url, true)
  if (typeof window !== 'undefined' && typeof history !== 'undefined') {
    let pushUrl = url
    if (window.basepath && window.basepath !== '/') {
      const base = window.basepath.replace(/\/+$/, '')
      pushUrl = `${base}/${url.replace(/^\/+/, '')}`
    }

    history.pushState(store.state.history, 'New Page', pushUrl)
  }
  yield setState('path', url)
  yield setState('query', parsedUrl.query || {})
  yield renderApp()
}

export default routeChange
