import LoginForm from '../components/LoginForm'

const Submit = async () => (
  `
    <p>You have to be logged in to submit</p>
    ${LoginForm()}
  `
)

export default Submit
