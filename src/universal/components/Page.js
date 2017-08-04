import Meta from './Meta'
import Header from './Header'

const Page = ({ children }) => (
  `
    <div class="main">
      ${Meta()}
      ${Header()}
      <div class="page">
        ${children}
      </div>
    </div>
  `
)

export default Page
