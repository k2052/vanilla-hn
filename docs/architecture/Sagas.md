# Sagas

A saga is an async generator function that takes events and yields effects. The effects are managed and executed by the store. Sagas provide a clear barrier between the good parts of the app and the bad parts.

## Writing a Saga

Imagine you live in a world of effects and comments. You want to manage these effects and edit comments. How would we construct a Saga that handles a change to comment text? First we need an async function that checks for an update comment event:

```js
async function* updateComment(action) {
  if (action.type !== UPDATE_COMMENT) {
    return
  }
}
```

Now that we have that we can make server request and yield errors or success effects:

```js
const { id } = action.payload
try {
  const res = await api.updateComment({ id })
  yield commentUpdateSuccess(res)
} catch (e) {
  yield commentUpdateFailure(e)
}
```

And finally we trigger a comment re-render:

```js
yield reRenderComment({ id })
```

## Testing a Saga

Because a saga yields functions we test that the application flow is correct by testing that it returns the right effects in the correct order. For example, if we have a routeChange saga we would expect it to yield a setState effect that changes the url:

```js
import { ROUTE_CHANGE } from '../../../src/universal/events/types'
import routeChange from '../../../src/client/sagas/routeChange'

test('it should set the path, qery, and re-render the app', async () => {
  const url = '/cats?cats=awesome'

  const action = {
    type: ROUTE_CHANGE,
    payload: {
      url,
    },
  }
  const gen = routeChange(action, {
    state: { history: {} },
  })

  // It should set the path
  let nxt = await gen.next()
  let { meta } = nxt.value
  let { path, state } = meta
  expect(meta.type).toBe('SET_STATE')
  expect(path).toBe('path')
  expect(state).toEqual(url)
})
```

## Further Resources

- [GetGood.at Article on Async Generators](https://getGood.at/js/async-generators)
- [redux-saga docs](https://github.com/redux-saga/redux-saga)
