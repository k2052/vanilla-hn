/**
 * TOOD: Make this vanilla node http code
 */
import root from 'window-or-global'
import Koa from 'koa'
import serve from 'koa-static'
import mount from 'koa-mount'
import view from '../universal/view'
import Store from '../universal/store'
import main from './views/main'

const app = new Koa()
app.use(mount('/assets', serve('./dist/assets')))

/**
 * Takes the state of the store and renders it a view representation
 */
app.use(async (ctx) => {
  const store = new Store([], {
    path: ctx.path,
    query: ctx.query,
    toggledComments: {},
  })
  root.store = store
  const content = await view(store.state)
  ctx.body = main({ content })
})

app.listen(3000)

export default app
