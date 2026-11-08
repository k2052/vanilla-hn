import Page from '../components/Page'
import Stories from '../components/Stories'
import getStories from '../lib/getStories'

const getInitialProps = async ({ query = {} } = {}, { api } = {}) => {
  const { page, p } = query
  const pageNum = Number(page || p || 1)
  const stories = await getStories('jobstories', { page: pageNum, api })
  return { page: pageNum, stories }
}

const Jobs = async (state = {}, options = {}) => {
  const api = options.api || state.api
  const { page, stories } = await getInitialProps(state, { api })
  const offset = (page - 1) * 30
  return `
    ${Page({
      children: Stories({ page, offset, stories, basePath: '/jobs' }),
    })}
  `
}

export default Jobs
