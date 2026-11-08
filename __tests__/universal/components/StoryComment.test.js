// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import StoryComment from '../../../src/universal/components/StoryComment'

describe('StoryComment component', () => {
  const comment = {
    id: 101,
    user: '<baduser>',
    text: '<p>Safe paragraph</p><script>alert(1)</script>',
    date: new Date(Date.now() - 10000),
    comments: [
      {
        id: 102,
        user: 'childuser',
        text: 'child text',
        date: new Date(),
        comments: [],
      },
    ],
  }

  it('renders expanded comment with sanitized text, escaped user, and child recursion', () => {
    document.body.innerHTML = StoryComment({
      ...comment,
      toggledComments: {},
    })

    const commentEl = document.querySelector('#comment-101')
    expect(commentEl).not.toBeNull()
    expect(document.querySelector('script')).toBeNull()
    expect(commentEl?.textContent).toContain('<baduser>')
    expect(commentEl?.textContent).toContain('Safe paragraph')

    const toggle = commentEl?.querySelector('[data-action="toggle-comment"]')
    expect(toggle?.getAttribute('data-id')).toBe('101')
    expect(toggle?.textContent?.trim()).toBe('[-]')

    // Child comment is present
    expect(document.querySelector('#comment-102')).not.toBeNull()

    // No global functions on window
    const leaked = Object.keys(window).filter((k) => k.startsWith('toggleId'))
    expect(leaked).toHaveLength(0)
  })

  it('renders collapsed state when comment is present in toggledComments', () => {
    document.body.innerHTML = StoryComment({
      ...comment,
      toggledComments: { 101: true },
    })

    const commentEl = document.querySelector('#comment-101')
    const toggle = commentEl?.querySelector('[data-action="toggle-comment"]')
    expect(toggle?.textContent?.trim()).toBe('[+2]')
    // Body and child comment should not be rendered
    expect(commentEl?.querySelector('.text')).toBeNull()
    expect(document.querySelector('#comment-102')).toBeNull()
  })
})
