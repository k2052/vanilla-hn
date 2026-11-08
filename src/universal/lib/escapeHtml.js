const ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/**
 * Escape HTML special characters in untrusted strings.
 * @param {string} str
 * @returns {string}
 */
export const escapeHtml = (str) => {
  if (str == null) return ''
  return String(str).replace(/[&<>"']/g, (s) => ESCAPE_MAP[s])
}

const ALLOWED_TAGS = new Set([
  'p',
  'a',
  'pre',
  'code',
  'i',
  'b',
  'span',
  'br',
  'em',
  'strong',
])

/**
 * Sanitize HTML in HN comments using an allowlist of tags and attributes.
 * Strips script tags, unknown elements, and dangerous attribute values (javascript:).
 *
 * @param {string} html
 * @returns {string}
 */
export const sanitizeCommentHtml = (html) => {
  if (html == null) return ''
  let sanitized = String(html)

  // Remove script and style elements completely including their contents
  sanitized = sanitized.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    '',
  )
  sanitized = sanitized.replace(
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    '',
  )

  // Match tags
  sanitized = sanitized.replace(
    /<\/?([a-zA-Z0-9]+)([^>]*)>/g,
    (match, tagName, rawAttrs) => {
      const tag = tagName.toLowerCase()
      if (!ALLOWED_TAGS.has(tag)) {
        return ''
      }

      const isClosing = match.startsWith('</')
      if (isClosing) {
        return `</${tag}>`
      }

      if (tag === 'a') {
        // Extract href
        const hrefMatch = rawAttrs.match(
          /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i,
        )
        const href = hrefMatch
          ? (hrefMatch[1] ?? hrefMatch[2] ?? hrefMatch[3] ?? '').trim()
          : ''

        const isSafeProtocol =
          /^https?:\/\//i.test(href) ||
          /^mailto:/i.test(href) ||
          /^[/#]/i.test(href)

        if (isSafeProtocol) {
          return `<a href="${escapeHtml(href)}" rel="nofollow noreferrer">`
        }
        return '<a>'
      }

      // Self-closing br
      if (tag === 'br') {
        return '<br />'
      }

      // Other allowed tags have no allowed attributes
      return `<${tag}>`
    },
  )

  return sanitized
}

export default escapeHtml
