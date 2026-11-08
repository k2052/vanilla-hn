import URL from 'url-parse'
import { escapeHtml } from '../lib/escapeHtml'
import timeAgo from '../lib/timeAgo'
import Link from './Link'

const plural = (n, s) => s + (n === 0 || n > 1 ? 's' : '')

const Story = ({
  id,
  title = '',
  date,
  url = '',
  user = '',
  score = 0,
  comments = [],
}) => {
  const commentsCount = comments ? comments.length : 0
  const cleanTitle = escapeHtml(title)
  const cleanUser = escapeHtml(user)
  const parsedUrl = url ? new URL(url) : null
  const host = parsedUrl?.hostname || ''
  const cleanHost = escapeHtml(host)

  const sourceMarkup = cleanHost
    ? `<span class="source"><a href="http://${cleanHost}">${cleanHost}</a></span>`
    : ''

  const storyLink = url || `/item?id=${id}`

  return `
  <div>
    <div class="title">
      ${Link({
        href: storyLink,
        children: cleanTitle,
      })}
      ${sourceMarkup}
    </div>
    <div class="meta">
      ${score} ${plural(score, 'point')} by
      ${Link({
        href: `/user?id=${cleanUser}`,
        children: cleanUser,
      })}
      ${Link({
        href: `/item?id=${id}`,
        children: `${timeAgo(new Date(date))} ago`,
      })}
      ${Link({
        href: `/item?id=${id}`,
        children: `${commentsCount} ${plural(commentsCount, 'comment')}`,
      })}
    </div>
  </div>
  `
}

export default Story
