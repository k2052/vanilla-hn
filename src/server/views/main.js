/**
 * A simple HTML wrapper
 */
const view = ({ content }) => (
  `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Vanilla HN</title>
        <link rel="stylesheet" type="text/css" href="assets/main.css" />
      </head>
      <body>
        <div id="app">${content}</div>
        <script type="text/javascript" src="assets/bundle.js"></script>
      </body>
    </html>
  `
)

export default view
