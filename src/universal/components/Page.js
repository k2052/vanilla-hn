import Header from './Header'
import Meta from './Meta'

const Page = ({ children }) => `
    <div class="main">
      ${Meta()}
      ${Header()}
      <div class="page">
        ${children}
      </div>
    </div>
  `

export default Page
