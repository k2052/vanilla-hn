// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import StoryItem from '../../../src/universal/components/StoryItem'

describe('StoryItem component', () => {
  it('composes Story, CommentForm, and comments thread', () => {
    const story = {
      id: 10,
      title: 'Show HN Story',
      user: 'alice',
      score: 100,
      date: new Date(),
      comments: [1],
    }
    const comments = [
      {
        id: 1,
        user: 'bob',
        text: 'Great post!',
        date: new Date(),
        comments: [],
      },
    ]

    document.body.innerHTML = StoryItem({ story, comments })
    expect(document.querySelector('.StoryItem')).not.toBeNull()
    expect(document.querySelector('.CommentForm')).not.toBeNull()
    expect(document.querySelector('.comments')).not.toBeNull()
    expect(document.querySelector('.comment')).not.toBeNull()
  })
})
