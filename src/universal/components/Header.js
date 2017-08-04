import Link from './Link'
import Logo from './Logo'
import Nav from './Nav'

const Header = () => (
  `
  <header>
    <div class="left">
     ${Link({
       href: '/',
       children: `
         ${Logo()}
         <span class="title">Vanilla HN</span>
       `,
     })}
      <div class="nav">
        ${Nav()}
      </div>
    </div>
    <div class="right">
      ${Link({
        href: '/login',
        children: '<span class="login">login</span>',
      })}
    </div>
  </header>
  `
)

export default Header
