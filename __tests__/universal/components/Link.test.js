// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import Link from '../../../src/universal/components/Link'

describe('Link component', () => {
  it('renders anchor tag with data-route attribute and no global handler leaks', () => {
    document.body.innerHTML = Link({ href: '/test', children: 'Click here' })
    const a = document.querySelector('a')
    expect(a?.getAttribute('href')).toBe('/test')
    expect(a?.hasAttribute('data-route')).toBe(true)
    expect(a?.textContent?.trim()).toBe('Click here')

    // Verify window is not polluted with handlers
    const handlerKeys = Object.keys(window).filter((k) =>
      k.startsWith('handler'),
    )
    expect(handlerKeys).toHaveLength(0)
  })
})
