import { escapeHtml, sanitizeCommentHtml } from '../lib/escapeHtml'
import timeAgo from '../lib/timeAgo'
import wrap from '../lib/wrap'

const CommentText = ({ text, children }) => `
  <div class="text">
    ${text}
  </div>
  ${children}
`

const StoryComment = ({
  user = '',
  text = '',
  date,
  comments = [],
  id,
  toggledComments,
  dispatch,
}) => {
  const isToggled = Boolean(toggledComments?.[id])

  let children = ''
  if (!isToggled && comments?.length) {
    comments.forEach((comment) => {
      children += StoryComment({
        ...comment,
        toggledComments,
        dispatch,
      })
    })
  }

  let body = ''
  if (!isToggled) {
    body = CommentText({
      text: sanitizeCommentHtml(text),
      children: `<div class="children">${children}</div>`,
    })
  }

  const cleanUser = escapeHtml(user)
  const commentCount = comments?.length || 0

  return `
    <div class="comment" id="comment-${id}">
      <div class="meta">
        ${cleanUser}
        ${timeAgo(new Date(date))} ago
        <span data-action="toggle-comment" data-id="${id}" class="toggle">
          ${isToggled ? `[+${commentCount + 1}]` : '[-]'}
        </span>
      </div>
      ${body}
    </div>
  `
}

export default wrap(
  {
    toggledComments: 'toggledComments',
  },
  StoryComment,
)
