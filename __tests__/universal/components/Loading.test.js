// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import Loading from '../../../src/universal/components/Loading'

describe('Loading component', () => {
  it('renders the spinner with three bounces', () => {
    document.body.innerHTML = Loading()
    const spinner = document.querySelector('.spinner')
    expect(spinner).not.toBeNull()
    expect(document.querySelectorAll('.spinner > div')).toHaveLength(3)
  })
})
