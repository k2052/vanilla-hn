import LoginForm from '../components/LoginForm'
import Page from '../components/Page'

const Submit = async () => `
  ${Page({
    children: `
      <p>You have to be logged in to submit</p>
      ${LoginForm()}
    `,
  })}
`

export default Submit
