import Link from './Link'

const Item = ({ href, children }) => (
  `
    <li>
      ${Link({
        href,
        children,
      })}
    </li>
  `
)

const Nav = () => (
  `
    <ul>
      ${Item({ href: '/newest', children: 'new' })}
      ${Item({ href: '/show', children: 'show' })}
      ${Item({ href: '/ask', children: 'ask' })}
      ${Item({ href: '/jobs', children: 'jobs' })}
      ${Item({ href: '/submit', children: 'submit' })}
    </ul>
  `
)

export default Nav
