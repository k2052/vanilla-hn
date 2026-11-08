// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import Header from '../../../src/universal/components/Header'

describe('Header component', () => {
  it('renders header with logo, title, nav, and login button', () => {
    document.body.innerHTML = Header()
    expect(document.querySelector('header')).not.toBeNull()
    expect(document.querySelector('.Logo')).not.toBeNull()
    expect(document.querySelector('.title')?.textContent).toContain(
      'Vanilla HN',
    )
    expect(document.querySelector('.login')?.textContent).toContain('login')
  })
})
