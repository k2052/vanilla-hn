import supertest from 'supertest'
import { describe, expect, test } from 'vitest'
import defaultServerApp, { createApp } from '../../src/server'
import { createMemoryApi } from '../../src/universal/lib/hnApi'

const fakeData = {
  topstories: [1],
  newstories: [1],
  showstories: [1],
  askstories: [1],
  jobstories: [1],
  'item/1': {
    id: 1,
    title: 'Test Story',
    by: 'testuser',
    time: 1600000000,
    score: 42,
    descendants: 1,
    kids: [2],
    url: 'https://example.com/story',
  },
  'item/2': {
    id: 2,
    by: 'commenter',
    text: 'A nice comment',
    time: 1600000010,
    descendants: 0,
    kids: [],
  },
}

const fakeApi = createMemoryApi(fakeData)
const app = createApp({ api: fakeApi })
const request = supertest(app.callback())

const pages = [
  '/',
  '/news',
  '/newest',
  '/show',
  '/ask',
  '/jobs',
  '/submit',
  '/login',
  '/item?id=1',
  '/user?id=testuser',
]

describe('Server routes with mock API', () => {
  test('exports default Koa app instance', () => {
    expect(defaultServerApp).toBeDefined()
    expect(typeof defaultServerApp.listen).toBe('function')
  })

  test('app should render the index page with stories', async () => {
    const res = await request.get('/').set('Accept', 'text/html')
    expect(res.status).toBe(200)
    expect(res.text).toContain('Test Story')
    expect(res.text).toContain('assets/bundle.js')
  })

  test('app should return assets', async () => {
    const res = await request.get('/assets/bundle.js')
    expect(res.status).toBe(200)
  })

  test('all documented routes should return 200', async () => {
    for (const page of pages) {
      const res = await supertest(app.callback())
        .get(page)
        .set('Accept', 'text/html')
      expect(res.status).toBe(200)
    }
  })

  test('unknown route should render 404 page', async () => {
    const res = await request
      .get('/unknown-route-12345')
      .set('Accept', 'text/html')
    expect(res.status).toBe(200)
    expect(res.text).toContain('404 - Page Not Found')
  })
})
