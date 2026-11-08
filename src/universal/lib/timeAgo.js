import ms from 'ms'

const map = {
  s: 'seconds',
  ms: 'milliseconds',
  m: 'minutes',
  h: 'hours',
  d: 'days',
  y: 'years',
}

const timeAgo = (date) => {
  const timestamp = date instanceof Date ? date.getTime() : Number(date)
  const diff = Math.max(0, Date.now() - timestamp)
  const formatted = ms(diff) || '0s'
  return formatted.replace(/[a-z]+/g, (str) => ` ${map[str] || str}`)
}

export default timeAgo
