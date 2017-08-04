# Effects

Effects are async functions that do a thing. They should only do one thing and never multiple things. They look like this:

```js
const renderApp = () => {
  const effect = async (store) => {
    const markup = await view(store.state)
    const elem = document.querySelector('#app')
    elem.innerHTML = markup

    return store
  }

  effect.meta = {
    type: 'RENDER_APP',
  }

  return effect
}
```
