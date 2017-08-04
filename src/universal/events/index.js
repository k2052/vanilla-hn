import { ROUTE_CHANGE, TOGGLE_COMMENT } from './types'

const routeChange = url => (
  {
    type: ROUTE_CHANGE,
    payload: {
      url,
    },
  }
)

const toggleComment = comment => (
  {
    type: TOGGLE_COMMENT,
    payload: comment,
  }
)

export {
  routeChange,
  toggleComment,
}
