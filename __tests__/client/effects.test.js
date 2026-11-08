// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { renderApp, toggleComment } from '../../src/client/effects'
import { createMemoryApi } from '../../src/universal/lib/hnApi'

describe('client effects', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>'
  })

  it('renderApp updates #app element with view markup', async () => {
    const fakeApi = createMemoryApi({
      topstories: [1],
      'item/1': {
        id: 1,
        title: 'Rendered Story',
        by: 'u',
        score: 1,
        time: 100,
        kids: [],
      },
    })

    const store = {
      state: {
        path: '/news',
        query: { page: 1 },
        api: fakeApi,
      },
    }

    const effect = renderApp()
    expect(effect.meta).toEqual({ type: 'RENDER_APP' })

    await effect(store)
    const appEl = document.querySelector('#app')
    expect(appEl.innerHTML).toContain('Rendered Story')
  })

  it('toggleComment updates #comment-<id> element markup with toggled state', async () => {
    document.body.innerHTML = `
      <div id="app">
        <div class="comment" id="comment-99">
          <div class="meta">
            user 1m ago
            <span class="toggle" data-action="toggle-comment" data-id="99">[-]</span>
          </div>
          <div class="text">Original text</div>
        </div>
      </div>
    `

    const comment = {
      id: 99,
      user: 'alice',
      text: 'Original text',
      date: new Date(),
      comments: [],
    }

    const store = {
      state: {
        toggledComments: { 99: true },
      },
      dispatch: () => {},
    }

    const effect = toggleComment(comment)
    expect(effect.meta).toEqual({ type: 'TOGGLE_COMMENT' })

    await effect(store)
    const updated = document.querySelector('#comment-99')
    expect(updated).not.toBeNull()
    expect(updated.querySelector('.toggle')?.textContent?.trim()).toBe('[+1]')
    expect(updated.querySelector('.text')).toBeNull()
  })
})
