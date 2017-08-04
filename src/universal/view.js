import match from './routes/match'

const view = async (state) => {
  const { path } = state
  const component = match(path)
  const markup = await component(state)
  return markup
}

export default view
