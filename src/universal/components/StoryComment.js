import wrap from '../lib/wrap'
import timeAgo from '../lib/timeAgo'
import { toggleComment } from '../events'

const CommentText = ({ text, children }) => (
   `
    <div class="text">
      ${text}
    </div>
    ${children}
  `
)

const StoryComment = ({ user, text, date, comments, id,
  parent = true, toggled = false, toggledComments, dispatch }) => {
  const toggle = () => { // eslint-disable-line
    dispatch(toggleComment({ user, text, date, comments, id }))
  }

  const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
  const uniqid = randLetter + Date.now()
  const toggleId = `toggleId${uniqid}`

  if (typeof window !== 'undefined') {
    window[toggleId] = toggle
  }

  let localToggled = toggled

  if (parent) {
    localToggled = toggledComments[id]
  }

  let children = ''

  if (!localToggled) {
    comments.forEach((comment) => {
      children += StoryComment({ ...comment, dispatch, parent: false, toggled: localToggled })
    })
  }

  let body = ''

  if (!localToggled) {
    body = CommentText({ text, children: `<div class="children">${children}</div>` })
  }

  return `
    <div class="comment" id="comment-${id}">
      <div class="meta">
        ${user}
        ${timeAgo(new Date(date))} ago
        <span onClick="${toggleId}()" class="toggle">
          ${localToggled ? `[+${(comments.length || 0) + 1}]` : '[-]'}
        </span>
      </div>
      ${body}
    </div>
  `
}

export default wrap({
  toggledComments: 'toggledComments',
}, StoryComment)
