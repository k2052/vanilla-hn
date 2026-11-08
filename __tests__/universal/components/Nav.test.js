// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import Nav from '../../../src/universal/components/Nav'

describe('Nav component', () => {
  it('renders navigation links for newest, show, ask, jobs, submit', () => {
    document.body.innerHTML = Nav()
    const links = Array.from(document.querySelectorAll('a')).map((a) =>
      a.getAttribute('href'),
    )
    expect(links).toEqual(['/newest', '/show', '/ask', '/jobs', '/submit'])
  })
})
