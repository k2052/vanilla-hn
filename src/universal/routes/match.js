import switchPathModule from 'switch-path'
import URL from 'url-parse'

import News from '../pages/News'
import NotFound from '../pages/NotFound'
import routes from './'

// switch-path ships an interop wrapper ({ __esModule: true, default: fn })
// under Node ESM, but esbuild unwraps it to `fn` for the client bundle.
// Normalise both shapes.
const switchPath = switchPathModule.default ?? switchPathModule

/**
 * We use the micro lib switch-path to match routes for now.
 * It is not possible to do any decent sort of routing with totally vanilla JS
 * Sort of cheating to use a lib but I think it doesn't detract from the main purpose of the project
 * which is to show what problems frameworks solve and why they work the way they do.
 */
const match = (path) => {
  const cat = new URL(path)
  const pathname = cat.pathname || '/'
  if (pathname === '/' || pathname === '') {
    return News
  }
  const matched = switchPath(pathname, routes)
  return matched?.value || NotFound
}

export default match
