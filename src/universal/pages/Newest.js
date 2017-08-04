import Page from '../components/Page'
import Stories from '../components/Stories'
import getStories from '../lib/getStories'

const getInitialProps = async ({ query }) => {
  const { p } = query
  const page = Number(p || 1)
  const stories = await getStories('newstories', { page })
  return { page, stories }
}

const News = async ({ query }) => {
  const { page, stories } = await getInitialProps({ query })
  const offset = (page - 1) * 30
  return `
    ${Page({
      children: Stories({ page, offset, stories }),
    })}
  `
}

export default News
