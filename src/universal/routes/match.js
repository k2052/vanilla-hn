import URL from 'url-parse'
import switchPath from 'switch-path'

import routes from './'

/**
 * We use the micro lib switch-path to match routes for now.
 * It is not possible to do any decent sort of routing with totally vanilla JS
 * Sort of cheating to use a lib but I think it doesn't detract from the main purpose of the project
 * which is to show what problems frameworks solve and why they work the way they do.
 */
const match = (path) => {
  const cat = new URL(path)
  const matched = switchPath(cat.pathname, routes)
  return matched.value
}

export default match
