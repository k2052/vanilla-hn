# Store

The store handles three things;

1. Managing state
2. Dispatching events to Sagas
3. Running effects

The store is only 39 lines and the heart of it is the dispatch function. dispatch takes an event and then passes it to every saga. Sagas are async generators that yield effects. Here is the source of the dispatch function:

```js
async dispatch(action) {
  for (let i = 0; i < this.sagas.length; i += 1) {
    const handler = this.sagas[i]
    for await(const effect of handler(action, this)) {
      await this.runEffect(effect) // eslint-disable-line
    }
  }
}
```

Effects are functions that take a store. They can do whatever they want, and might do very side-effect things. Running an effect is a simple function call:

```js
async runEffect(effect) {
  try {
    await effect(this)
  } catch (e) {
    console.log(e)
  }
}
```

The state of the store is simply a plain object. Under real world scenarios, you'd likely want to use something [baobab](https://github.com/Yomguithereal/baobab) or [Immutable.js](https://facebook.github.io/immutable-js/)

That is all there is to the store!

## Further Resources

- [GetGood.at Article on Async Generators](https://getGood.at/js/async-generators)
- [List of Data Structure Libraries](https://github.com/stoeffel/awesome-fp-js#data-structures)

You might want to read to about the Flux architecture as well:

- [Flux](https://facebook.github.io/flux/)

And since the yield effect model strongly resembles redux-saga the docs for that library are also worth a look:

- [redux-saga docs](https://github.com/redux-saga/redux-saga)
