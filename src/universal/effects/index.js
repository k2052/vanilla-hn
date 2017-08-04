const setState = (path, state) => {
  const setter = async (store) => {
    store.state[path] = state // eslint-disable-line
    return store
  }

  setter.meta = {
    path,
    state,
    type: 'SET_STATE',
  }

  return setter
}

export {
  setState, // eslint-disable-line
}
