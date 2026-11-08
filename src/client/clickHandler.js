import { routeChange, toggleComment } from '../universal/events'

export const createClickHandler = (store) => (e) => {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
    return
  }

  const target = e.target
  if (!target || typeof target.closest !== 'function') return

  const toggleEl = target.closest('[data-action="toggle-comment"]')
  if (toggleEl) {
    e.preventDefault()
    const id = toggleEl.getAttribute('data-id')
    if (id) {
      store.dispatch(toggleComment({ id: Number(id) || id }))
    }
    return
  }

  const linkEl = target.closest('a[data-route]')
  if (linkEl) {
    const href = linkEl.getAttribute('href')
    if (href && !href.startsWith('http://') && !href.startsWith('https://')) {
      e.preventDefault()
      store.dispatch(routeChange(href))
    }
  }
}

export default createClickHandler
