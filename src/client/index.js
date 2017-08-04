import { routeChange } from '../universal/events'
import { renderApp } from './effects'
import sagas from './sagas'
import Store from '../universal/store'

require('../styles/app.css')

window.basepath = window.location.pathname
const store = new Store(sagas, {
  path: window.location.pathname || '/',
  query: window.location.query || {},
  toggledComments: {},
})
window.store = store
store.runEffect(renderApp())

window.onpopstate = () => {
  store.dispatch(routeChange(window.location.pathname + window.location.search))
}
