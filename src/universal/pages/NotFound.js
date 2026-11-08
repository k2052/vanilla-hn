import Page from '../components/Page'

const NotFound = async () => `
  ${Page({
    children: `
      <div style="padding: 20px;">
        <h2>404 - Page Not Found</h2>
        <p>The page you requested could not be found.</p>
      </div>
    `,
  })}
`

export default NotFound
