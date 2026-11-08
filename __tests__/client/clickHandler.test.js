// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import createClickHandler from '../../src/client/clickHandler'
import { ROUTE_CHANGE, TOGGLE_COMMENT } from '../../src/universal/events/types'

describe('createClickHandler', () => {
  it('dispatches toggleComment when clicking an element with data-action="toggle-comment"', () => {
    const store = { dispatch: vi.fn() }
    const handler = createClickHandler(store)

    document.body.innerHTML = `
      <div id="comment-42">
        <span class="toggle" data-action="toggle-comment" data-id="42">[-]</span>
      </div>
    `
    const toggleBtn = document.querySelector('.toggle')
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      button: 0,
    })
    toggleBtn.dispatchEvent(event)

    handler(event)
    expect(store.dispatch).toHaveBeenCalledWith({
      type: TOGGLE_COMMENT,
      payload: { id: 42 },
    })
  })

  it('dispatches routeChange when clicking internal link with data-route', () => {
    const store = { dispatch: vi.fn() }
    const handler = createClickHandler(store)

    document.body.innerHTML = `
      <a href="/newest" data-route><span>new</span></a>
    `
    const span = document.querySelector('span')
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      button: 0,
    })
    span.dispatchEvent(event)

    handler(event)
    expect(store.dispatch).toHaveBeenCalledWith({
      type: ROUTE_CHANGE,
      payload: { url: '/newest' },
    })
  })

  it('ignores clicks with modifier keys (ctrl, meta, shift, alt) or right click', () => {
    const store = { dispatch: vi.fn() }
    const handler = createClickHandler(store)

    document.body.innerHTML = `<a href="/newest" data-route>new</a>`
    const link = document.querySelector('a')

    const ctrlClick = new MouseEvent('click', {
      bubbles: true,
      button: 0,
      ctrlKey: true,
    })
    link.dispatchEvent(ctrlClick)
    handler(ctrlClick)

    const rightClick = new MouseEvent('click', { bubbles: true, button: 2 })
    link.dispatchEvent(rightClick)
    handler(rightClick)

    expect(store.dispatch).not.toHaveBeenCalled()
  })

  it('does not dispatch routeChange for external links starting with http://', () => {
    const store = { dispatch: vi.fn() }
    const handler = createClickHandler(store)

    document.body.innerHTML = `<a href="https://example.com" data-route>ext</a>`
    const link = document.querySelector('a')
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      button: 0,
    })
    link.dispatchEvent(event)
    handler(event)

    expect(store.dispatch).not.toHaveBeenCalled()
  })
})
