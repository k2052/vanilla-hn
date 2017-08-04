import Page from '../components/Page'
import Stories from '../components/Stories'
import getStories from '../lib/getStories'

const getInitialProps = async ({ query }) => {
  let { page } = query
  page = Number(page || 1)
  const stories = await getStories('topstories', { page })
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
