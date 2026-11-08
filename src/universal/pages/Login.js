import LoginForm from '../components/LoginForm'
import Page from '../components/Page'

const Login = async () => `
  ${Page({
    children: LoginForm(),
  })}
`

export default Login
