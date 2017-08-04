import URL from 'url-parse'
import timeAgo from '../lib/timeAgo'
import Link from './Link'

const plural = (n, s) => s + ((n === 0 || n > 1) ? 's' : '')

const Story = ({ id, title, date, url, user, score, comments }) => {
  const commentsCount = comments.length
  const parsedUrl = new URL(url)
  const host = parsedUrl.hostname
  return `
  <div>
    <div class="title">
      ${Link({
        href: url,
        children: `${title}`,
      })}
      <span class="source">
        <a href="http://${host}">${host}</a>
      </span>
    </div>
    <div class="meta">
      ${score}
      ${plural(score, 'point')}
      by
      ${Link({
        href: `/user?id=${user}`,
        children: `
          ${user}
        `,
      })}
      ${Link({
        href: `/item?id=${id}`,
        children: `
          ${timeAgo(new Date(date))} ago
        `,
      })}
      ${Link({
        href: `/item?id=${id}`,
        children: `
          ${commentsCount}
          ${plural(commentsCount, 'comment')}
        `,
      })}
    </div>
  </div>
  `
}

export default Story
