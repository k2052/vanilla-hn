import { describe, expect, it } from 'vitest'
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
import routes from '../../../src/universal/routes'
import match from '../../../src/universal/routes/match'

describe('Routes & Router match', () => {
  it('defines all required page routes', () => {
    expect(routes['/news']).toBe(News)
    expect(routes['/newest']).toBe(Newest)
    expect(routes['/show']).toBe(Show)
    expect(routes['/ask']).toBe(Ask)
    expect(routes['/jobs']).toBe(Jobs)
    expect(routes['/login']).toBe(Login)
    expect(routes['/submit']).toBe(Submit)
    expect(routes['/item']).toBe(Item)
    expect(routes['/user']).toBe(User)
    expect(routes['*']).toBe(NotFound)
  })

  it('matches / and /news to News page', () => {
    expect(match('/')).toBe(News)
    expect(match('/news')).toBe(News)
    expect(match('/news?page=2')).toBe(News)
  })

  it('matches all subpages correctly', () => {
    expect(match('/newest')).toBe(Newest)
    expect(match('/show')).toBe(Show)
    expect(match('/ask')).toBe(Ask)
    expect(match('/jobs')).toBe(Jobs)
    expect(match('/submit')).toBe(Submit)
    expect(match('/login')).toBe(Login)
    expect(match('/item?id=123')).toBe(Item)
    expect(match('/user?id=someone')).toBe(User)
  })

  it('returns NotFound for unknown routes', () => {
    expect(match('/unknown-route-xyz')).toBe(NotFound)
    expect(match('/not/found/here')).toBe(NotFound)
  })
})
