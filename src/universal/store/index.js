class Store {
  constructor(sagas, initialState = {}) {
    this.state = initialState
    this.sagas = sagas
    this.listeners = []
  }

  addHandler(handler) {
    this.sagas.push(handler)
  }

  addListener(listener) {
    this.listeners.push(listener)
  }

  async runEffect(effect) {
    try {
      await effect(this)
    } catch (e) {
      console.log(e)
    }
  }

  async dispatch(action) {
    for (let i = 0; i < this.sagas.length; i += 1) {
      const handler = this.sagas[i]
      for await(const effect of handler(action, this)) {
        await this.runEffect(effect) // eslint-disable-line
      }
    }

    for (let i = 0; i < this.listeners.length; i += 1) {
      const listener = this.listeners[i]
      listener(action)
    }

    return true
  }
}

export default Store
