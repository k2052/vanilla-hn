// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import Logo from '../../../src/universal/components/Logo'

describe('Logo component', () => {
  it('renders logo text N', () => {
    document.body.innerHTML = Logo()
    const el = document.querySelector('.Logo')
    expect(el?.textContent?.trim()).toBe('N')
  })
})
