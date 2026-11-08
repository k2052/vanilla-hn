// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import Page from '../../../src/universal/components/Page'

describe('Page component', () => {
  it('composes Meta, Header, and children into .main container', () => {
    document.body.innerHTML = Page({
      children: '<div class="content">Hello World</div>',
    })
    expect(document.querySelector('.main')).not.toBeNull()
    expect(document.querySelector('header')).not.toBeNull()
    expect(document.querySelector('.content')?.textContent).toBe('Hello World')
  })
})
