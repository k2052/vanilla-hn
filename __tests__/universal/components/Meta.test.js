// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import Meta from '../../../src/universal/components/Meta'

describe('Meta component', () => {
  it('renders viewport and charset meta tags', () => {
    const markup = Meta()
    expect(markup).toContain('name="viewport"')
    expect(markup).toContain('charSet="utf-8"')
  })
})
