import { routeChange } from '../universal/events'
import Store from '../universal/store'
import { createClickHandler } from './clickHandler'
import { renderApp } from './effects'
import sagas from './sagas'

import '../styles/app.css'

export const parseQuery = (search = '') => {
  const params = new URLSearchParams(search)
  const query = {}
  for (const [key, val] of params.entries()) {
    query[key] = val
  }
  return query
}

export function createApp() {
  if (typeof window === 'undefined') return null

  window.basepath = '/'
  const store = new Store(sagas, {
    path: window.location.pathname || '/',
    query: parseQuery(window.location.search),
    toggledComments: {},
  })
  window.store = store

  const clickHandler = createClickHandler(store)
  if (typeof document !== 'undefined') {
    document.addEventListener('click', clickHandler)
  }

  window.onpopstate = () => {
    store.dispatch(
      routeChange(window.location.pathname + window.location.search),
    )
  }

  store.runEffect(renderApp())
  return { store, clickHandler }
}

createApp()
