import News from '../pages/News'
import Newest from '../pages/Newest'
import Show from '../pages/Show'
import Ask from '../pages/Ask'
import Jobs from '../pages/Jobs'
import Submit from '../pages/Submit'
import Item from '../pages/Item'
import User from '../pages/User'

const routes = {
  '/news': News,
  '/newest': Newest,
  '/show': Show,
  '/ask': Ask,
  '/jobs': Jobs,
  '/submit': Submit,
  '/item': Item,
  '/user': User,
  '*': News,
}

export default routes
