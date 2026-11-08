// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import Story from '../../../src/universal/components/Story'

describe('Story component', () => {
  it('renders title, score with point pluralization, host source, and escapes unsafe content', () => {
    const rawStory = {
      id: 123,
      title: '<script>alert(1)</script> Hello & "World"',
      user: 'attacker<tag>',
      score: 1,
      date: new Date(Date.now() - 3600 * 1000),
      url: 'https://news.ycombinator.com/item?id=123',
      comments: [1],
    }

    document.body.innerHTML = Story(rawStory)
    expect(document.querySelector('script')).toBeNull()
    expect(document.querySelector('.title')?.textContent).toContain(
      '<script>alert(1)</script> Hello & "World"',
    )
    expect(document.querySelector('.source')?.textContent).toContain(
      'news.ycombinator.com',
    )
    expect(document.querySelector('.meta')?.textContent).toContain('1 point by')
    expect(document.querySelector('.meta')?.textContent).toContain(
      'attacker<tag>',
    )
    expect(document.querySelector('.meta')?.textContent).toContain('1 comment')
  })

  it('pluralizes points and comments when score > 1 or 0', () => {
    document.body.innerHTML = Story({
      id: 1,
      title: 'Plural test',
      user: 'alice',
      score: 5,
      date: new Date(),
      comments: [1, 2, 3],
    })
    expect(document.querySelector('.meta')?.textContent).toContain('5 points')
    expect(document.querySelector('.meta')?.textContent).toContain('3 comments')
  })
})
