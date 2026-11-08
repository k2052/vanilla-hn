# Security & HTML Escaping

Vanilla HN renders markup using template strings rather than a virtual DOM. Because template strings perform raw string interpolation by default, untrusted content from the Hacker News API must be explicitly sanitized to prevent Cross-Site Scripting (XSS).

## Escaping Strategy

Untrusted data from the Hacker News API falls into two categories:

### 1. Plain Text Fields (Titles, Usernames, URLs)

Fields such as story titles, submitter usernames, and URLs are escaped using `escapeHtml(str)` in `src/universal/lib/escapeHtml.js`. This replaces:

- `&` with `&amp;`
- `<` with `&lt;`
- `>` with `&gt;`
- `"` with `&quot;`
- `'` with `&#39;`

Applied at:
- `Story.js`: `title`, `user`, `host`
- `StoryComment.js`: `user`

### 2. Rich Text Fields (Comment Bodies)

Hacker News comments contain pre-rendered HTML (such as `<p>`, `<i>`, `<a>`, `<pre><code>`). Dropping this HTML directly into `innerHTML` is an XSS vector if malicious attributes or script tags are injected.

We sanitize comment text using `sanitizeCommentHtml(html)`:
- Strips `<script>` and `<style>` elements along with their contents entirely.
- Allowlist of permitted tags: `<p>`, `<a>`, `<pre>`, `<code>`, `<i>`, `<b>`, `<span>`, `<br>`, `<em>`, `<strong>`.
- For `<a>` tags, only safe protocols (`http://`, `https://`, `mailto:`, `/`, `#`) are allowed in `href`. Dangerous schemes (`javascript:`, `data:`, `vbscript:`) are stripped.
- Injects `rel="nofollow noreferrer"` onto external links.
- Strips all inline event handlers (`onclick`, `onerror`, etc.) and non-allowlisted tags (`<img>`, `<iframe>`, `<object>`).

Applied at:
- `StoryComment.js`: `text`
