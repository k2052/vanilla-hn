import { TOGGLE_COMMENT } from '../../universal/events/types'
import { setState } from '../../universal/effects'
import { toggleComment as toggleCommentEffect } from '../effects'

/**
 * Tooggles a comment;
 * 1. Adds the id of the comment to toggledComments in state
 * 2. Dispatches a toggleCommentEffect that causes the comment to re-render
 */
async function* toggleComment(action, store) {
  // return if this is not a TOGGLE_COMMENT event
  if (action.type !== TOGGLE_COMMENT) {
    return
  }

  const { id } = action.payload

  yield setState('toggledComments', {
    ...store.state.toggledComments,
    [id]: !store.state.toggledComments[id],
  })

  yield toggleCommentEffect(action.payload)
}

export default toggleComment
