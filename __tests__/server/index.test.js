import supertest from 'supertest'
import app from '../../src/server'

const request = supertest(app.listen())
const pages = [
  '/news',
  '/newest',
  '/show',
  '/ask',
  '/jobs',
  '/submit',
]

test('app should render the index page', async () => {
  const res = await request
                     .get('/')
                     .set('Accept', 'text/html')

  expect(res.status).toBe(200)
})

test('app should return assets', async () => {
  const res = await request
                     .get('/assets/bundle.js')

  expect(res.status).toBe(200)
})

test('all the routes should return 200', async () => {
  for (const page of pages) { // eslint-disable-line
    const res = await request // eslint-disable-line
                     .get(page)
                     .set('Accept', 'text/html')
    expect(res.status).toBe(200)
  }
})
