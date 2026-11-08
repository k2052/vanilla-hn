import { describe, expect, it } from 'vitest'
import { createMemoryApi } from '../../../src/universal/lib/hnApi'
import defaultPage from '../../../src/universal/pages'
import Ask from '../../../src/universal/pages/Ask'
import Item from '../../../src/universal/pages/Item'
import Jobs from '../../../src/universal/pages/Jobs'
import Login from '../../../src/universal/pages/Login'
import Newest from '../../../src/universal/pages/Newest'
import News from '../../../src/universal/pages/News'
import NotFound from '../../../src/universal/pages/NotFound'
import Show from '../../../src/universal/pages/Show'
import Submit from '../../../src/universal/pages/Submit'
import User from '../../../src/universal/pages/User'

describe('Universal Pages with Mock API', () => {
  const fakeApi = createMemoryApi({
    topstories: [1],
    newstories: [1],
    showstories: [1],
    askstories: [1],
    jobstories: [1],
    'item/1': {
      id: 1,
      title: 'Story 1',
      by: 'user1',
      score: 10,
      time: 1600000000,
      descendants: 1,
      kids: [2],
    },
    'item/2': {
      id: 2,
      by: 'user2',
      text: 'Comment 2',
      time: 1600000010,
      kids: [],
    },
  })

  it('exports News as default from pages/index.js', () => {
    expect(defaultPage).toBe(News)
  })

  it('renders News page with correct basePath and story', async () => {
    const html = await News({ query: { page: 1 }, api: fakeApi })
    expect(html).toContain('Story 1')
    expect(html).toContain('/news?page=2')
  })

  it('renders Newest page with correct basePath', async () => {
    const html = await Newest({ query: { p: 1 }, api: fakeApi })
    expect(html).toContain('Story 1')
    expect(html).toContain('/newest?page=2')
  })

  it('renders Show page with correct basePath', async () => {
    const html = await Show({ query: { page: 1 }, api: fakeApi })
    expect(html).toContain('Story 1')
    expect(html).toContain('/show?page=2')
  })

  it('renders Ask page with correct basePath', async () => {
    const html = await Ask({ query: { page: 1 }, api: fakeApi })
    expect(html).toContain('Story 1')
    expect(html).toContain('/ask?page=2')
  })

  it('renders Jobs page with correct basePath', async () => {
    const html = await Jobs({ query: { page: 1 }, api: fakeApi })
    expect(html).toContain('Story 1')
    expect(html).toContain('/jobs?page=2')
  })

  it('renders Item page with story and comments', async () => {
    const html = await Item({ query: { id: 1 }, api: fakeApi })
    expect(html).toContain('Story 1')
    expect(html).toContain('Comment 2')
  })

  it('renders Item page with fallback when item is missing', async () => {
    const html = await Item({ query: { id: 999 }, api: fakeApi })
    expect(html).toContain('Story not found')
  })

  it('renders Login page', async () => {
    const html = await Login()
    expect(html).toContain('Login')
    expect(html).toContain('create account')
  })

  it('renders Submit page', async () => {
    const html = await Submit()
    expect(html).toContain('You have to be logged in to submit')
  })

  it('renders User page', async () => {
    const html = await User()
    expect(html).toContain('user page (WIP)')
  })

  it('renders NotFound page', async () => {
    const html = await NotFound()
    expect(html).toContain('404 - Page Not Found')
  })
})
