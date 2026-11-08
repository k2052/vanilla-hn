/**
 * TODO: Make this vanilla node http code
 */

import Koa from 'koa'
import mount from 'koa-mount'
import serve from 'koa-static'
import root from 'window-or-global'
import Store from '../universal/store'
import view from '../universal/view'
import main from './views/main'

export function createApp({ api } = {}) {
  const app = new Koa()
  app.use(mount('/assets', serve('./dist/assets')))

  /**
   * Takes the state of the store and renders it as a view representation
   */
  app.use(async (ctx) => {
    const store = new Store([], {
      path: ctx.path,
      query: ctx.query,
      toggledComments: {},
      api,
    })
    root.store = store
    const content = await view(store.state, { api })
    ctx.body = main({ content })
  })

  return app
}

const app = createApp()

// Only bind a port when run directly (not when imported by tests / SSR build).
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(3000)
}

export default app
