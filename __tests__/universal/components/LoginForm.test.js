// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import LoginForm from '../../../src/universal/components/LoginForm'

describe('LoginForm component', () => {
  it('renders login and create account form', () => {
    document.body.innerHTML = LoginForm()
    expect(document.querySelector('.LoginForm')).not.toBeNull()
    expect(document.querySelectorAll('.LoginForm button')).toHaveLength(2)
  })
})
