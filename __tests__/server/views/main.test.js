// @vitest-environment jsdom
import { describe, expect, test } from 'vitest'
import view from '../../../src/server/views/main'

describe('server main view', () => {
  test('the view should return html with content in the app div', () => {
    const content = 'cats'
    const doc = new DOMParser().parseFromString(view({ content }), 'text/html')
    expect(doc.querySelector('#app')?.textContent).toBe('cats')
  })

  test('it should reference the client bundle and stylesheet by default', () => {
    const doc = new DOMParser().parseFromString(
      view({ content: '' }),
      'text/html',
    )
    expect(doc.querySelector('script')?.getAttribute('src')).toBe(
      'assets/bundle.js',
    )
    expect(
      doc.querySelector('link[rel="stylesheet"]')?.getAttribute('href'),
    ).toBe('assets/main.css')
  })

  test('it accepts custom script and css paths for dev or manifest-hashed prod assets', () => {
    const doc = new DOMParser().parseFromString(
      view({
        content: 'hello',
        scriptPath: '/src/client/index.js',
        cssPath: 'assets/main.12345.css',
      }),
      'text/html',
    )
    expect(doc.querySelector('script')?.getAttribute('src')).toBe(
      '/src/client/index.js',
    )
    expect(
      doc.querySelector('link[rel="stylesheet"]')?.getAttribute('href'),
    ).toBe('assets/main.12345.css')
  })
})
