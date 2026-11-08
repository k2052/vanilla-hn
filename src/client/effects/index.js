import Loading from '../../universal/components/Loading'
import StoryComment from '../../universal/components/StoryComment'
import view from '../../universal/view'

/**
 * Handles turning the state of the store into HTML.
 * Once we have a representation of the state we use innerHTML to re-render the app.
 */
const renderApp = () => {
  const effect = async (store) => {
    const elem = document.querySelector('#app')
    if (elem) {
      elem.innerHTML = Loading(store.state)
      const markup = await view(store.state)
      elem.innerHTML = markup
    }
    return store
  }

  effect.meta = {
    type: 'RENDER_APP',
  }

  return effect
}

/**
 * Toggles a comment.
 * Replaces the comment markup with updated collapsed/expanded state.
 */
const toggleComment = (comment) => {
  const effect = async (store) => {
    const { id } = comment
    const elem = document.querySelector(`#comment-${id}`)
    if (elem) {
      const markup = StoryComment({
        ...comment,
        toggledComments: store.state.toggledComments,
        dispatch: (action) => store.dispatch(action),
      })
      elem.outerHTML = markup
    }
    return store
  }

  effect.meta = {
    type: 'TOGGLE_COMMENT',
  }

  return effect
}

export { renderApp, toggleComment }
