import { describe, expect, it } from 'vitest'
import {
  escapeHtml,
  sanitizeCommentHtml,
} from '../../../src/universal/lib/escapeHtml'

describe('escapeHtml', () => {
  it('escapes &, <, >, ", and \'', () => {
    expect(escapeHtml('<script>alert("xss & \'fun\'")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss &amp; &#39;fun&#39;&quot;)&lt;/script&gt;',
    )
  })

  it('handles null and undefined', () => {
    expect(escapeHtml(null)).toBe('')
    expect(escapeHtml(undefined)).toBe('')
  })

  it('handles numbers and booleans', () => {
    expect(escapeHtml(123)).toBe('123')
    expect(escapeHtml(false)).toBe('false')
  })
})

describe('sanitizeCommentHtml', () => {
  it('allows safe HTML tags like <p>, <a>, <i>, <code>', () => {
    const input =
      '<p>Hello <i>world</i>, see <a href="https://news.ycombinator.com">HN</a></p>'
    expect(sanitizeCommentHtml(input)).toBe(
      '<p>Hello <i>world</i>, see <a href="https://news.ycombinator.com" rel="nofollow noreferrer">HN</a></p>',
    )
  })

  it('removes <script> tags and their contents', () => {
    const input = '<p>Hi</p><script>alert("xss")</script><p>There</p>'
    expect(sanitizeCommentHtml(input)).toBe('<p>Hi</p><p>There</p>')
  })

  it('removes disallowed tags like <img>, <iframe>, <object>', () => {
    const input = '<img src="x" onerror="alert(1)" /><iframe>evil</iframe>'
    expect(sanitizeCommentHtml(input)).toBe('evil')
  })

  it('blocks javascript: URLs in <a> tags', () => {
    const input = '<a href="javascript:alert(1)">Click me</a>'
    expect(sanitizeCommentHtml(input)).toBe('<a>Click me</a>')
  })

  it('strips inline event handlers', () => {
    const input = '<p onclick="alert(1)">Text</p>'
    expect(sanitizeCommentHtml(input)).toBe('<p>Text</p>')
  })

  it('handles null and undefined', () => {
    expect(sanitizeCommentHtml(null)).toBe('')
    expect(sanitizeCommentHtml(undefined)).toBe('')
  })
})
