// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import Stories from '../../../src/universal/components/Stories'

describe('Stories component', () => {
  const sampleStories = [
    {
      id: 1,
      title: 'Story One',
      date: new Date(),
      user: 'u1',
      score: 10,
      comments: [],
    },
    {
      id: 2,
      title: 'Story Two',
      date: new Date(),
      user: 'u2',
      score: 20,
      comments: [],
    },
  ]

  it('renders story items with offset numbering and pagination link using basePath', () => {
    document.body.innerHTML = Stories({
      stories: sampleStories,
      page: 2,
      offset: 30,
      basePath: '/ask',
    })

    const counts = Array.from(document.querySelectorAll('.count')).map(
      (el) => el.textContent,
    )
    expect(counts).toEqual(['31', '32'])

    const moreLink = document.querySelector('.footer a')
    expect(moreLink?.getAttribute('href')).toBe('/ask?page=3')
    expect(moreLink?.textContent?.trim()).toBe('More')
  })
})
