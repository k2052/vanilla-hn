const Link = ({ href, children }) => `
  <a href="${href}" data-route>
    ${children}
  </a>
`

export default Link
