import wrap from '../lib/wrap'
import { routeChange } from '../events'

const Link = ({ href, dispatch, children }) => {
  const handler = (e) => { // eslint-disable-line
    e.preventDefault()
    dispatch(routeChange(href))
  }

  const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
  const uniqid = randLetter + Date.now()
  const handlerId = `handler${uniqid}`

  if (typeof window !== 'undefined') {
    window[handlerId] = handler
  }

  return `
    <a href="${href}" onclick="${handlerId}(event)">
      ${children}
    </a>
  `
}

export default wrap({}, Link)
