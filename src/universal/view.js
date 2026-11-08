import match from './routes/match'

const view = async (state, { api } = {}) => {
  const { path } = state
  const effectiveApi = api || state?.api
  const component = match(path)
  const markup = await component(state, { api: effectiveApi })
  return markup
}

export default view
