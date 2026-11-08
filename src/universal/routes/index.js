import Ask from '../pages/Ask'
import Item from '../pages/Item'
import Jobs from '../pages/Jobs'
import Login from '../pages/Login'
import Newest from '../pages/Newest'
import News from '../pages/News'
import NotFound from '../pages/NotFound'
import Show from '../pages/Show'
import Submit from '../pages/Submit'
import User from '../pages/User'

const routes = {
  '/news': News,
  '/newest': Newest,
  '/show': Show,
  '/ask': Ask,
  '/jobs': Jobs,
  '/login': Login,
  '/submit': Submit,
  '/item': Item,
  '/user': User,
  '*': NotFound,
}

export default routes
