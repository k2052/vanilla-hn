import view from '../../universal/view'
import StoryComment from '../../universal/components/StoryComment'
import Loading from '../../universal/components/Loading'

/**
 * Handles turning the state of the store into HTML.
 * Once we have a representation the state we use innerHTML to re-render the app.
 *
 * The default scenario for the entire app to be re-rendered,
 * but we can add effects for re-rendering the representation of a slice of state.
 * InnerHTML is pretty performant and in many cases you can cheat and just re-render an entire app.
 */
const renderApp = () => {
  const effect = async (store) => {
    const elem = document.querySelector('#app')
    elem.innerHTML = Loading(store.state)
    const markup = await view(store.state)
    elem.innerHTML = markup

    return store
  }

  effect.meta = {
    type: 'RENDER_APP',
  }

  return effect
}

/**
 * Toggles a comment.
 * Takes a comment and generates a new representation of it with the comment hidden.
 */
const toggleComment = (comment) => {
  const effect = async (store) => {
    const { id } = comment
    const markup = StoryComment(comment)
    const elem = document.querySelector(`#comment-${id}`)
    elem.innerHTML = markup

    return store
  }

  effect.meta = {
    type: 'TOGGLE_COMMENT',
  }

  return effect
}

export {
  renderApp,
  toggleComment,
}
