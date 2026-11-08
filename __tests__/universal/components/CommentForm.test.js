// @vitest-environment jsdom
import { describe, expect, test } from 'vitest'
import view from '../../../src/universal/components/CommentForm'

describe('CommentForm component', () => {
  test('it should render a comment form with an add-comment button', () => {
    document.body.innerHTML = view()
    expect(document.querySelector('.CommentForm button')?.textContent).toBe(
      'add comment',
    )
  })
})
