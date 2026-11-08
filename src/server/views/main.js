/**
 * A simple HTML wrapper
 */
const view = ({
  content = '',
  scriptPath = 'assets/bundle.js',
  cssPath = 'assets/main.css',
}) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Vanilla HN</title>
        <link rel="stylesheet" type="text/css" href="${cssPath}" />
      </head>
      <body>
        <div id="app">${content}</div>
        <script type="text/javascript" src="${scriptPath}"></script>
      </body>
    </html>
  `

export default view
