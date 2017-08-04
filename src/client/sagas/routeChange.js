import URL from 'url-parse'
import { ROUTE_CHANGE } from '../../universal/events/types'
import { renderApp } from '../effects'
import { setState } from '../../universal/effects'

/**
 * Handles route changes;
 * 1. Takes the new url and pushes it onto the history object
 * 2. Sets the path state in the store to the new url
 * 3. Sets the query state to the parsed query string
 * 4. Triggers a re-render of the app
 */
async function* routeChange(action, store) {
  // return if this is not a route change event
  if (action.type !== ROUTE_CHANGE) {
    return
  }

  let { url } = action.payload
  const parsedUrl = new URL(url, true)
  if (typeof window !== 'undefined') {
    if (window.basepath !== '/') {
      url = `${window.basepath}${url.replace(/^\/+/g, '')}`
    }

    history.pushState(store.state.history, 'New Page', url)
  }
  yield setState('path', url)
  yield setState('query', parsedUrl.query)
  yield renderApp()
}

export default routeChange
