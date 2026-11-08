// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createApp, parseQuery } from '../../src/client'

describe('client index entry', () => {
  it('parseQuery parses search parameters into an object', () => {
    expect(parseQuery('?page=3&filter=active')).toEqual({
      page: '3',
      filter: 'active',
    })
    expect(parseQuery('')).toEqual({})
    expect(parseQuery(undefined)).toEqual({})
  })

  it('createApp initializes store and registers event listeners', () => {
    document.body.innerHTML = '<div id="app"></div>'
    const app = createApp()
    expect(app).not.toBeNull()
    expect(app.store).toBeDefined()
    expect(window.store).toBe(app.store)
    expect(typeof app.clickHandler).toBe('function')
  })
})
