import Page from '../components/Page'
import ItemComponent from '../components/StoryItem'
import getComments from '../lib/getComments'
import getItem from '../lib/getItem'

const getInitialProps = async ({ query = {} } = {}, { api } = {}) => {
  const { id } = query
  const story = id ? await getItem(id, { api }) : null
  const comments = story?.comments?.length
    ? await getComments(story.comments, { api })
    : []
  return { story, comments, id }
}

const Item = async (state = {}, options = {}) => {
  const api = options.api || state.api
  const { story, comments } = await getInitialProps(state, { api })

  if (!story) {
    return `
      ${Page({
        children: '<div style="padding: 20px;">Story not found.</div>',
      })}
    `
  }

  return `
    ${Page({
      children: ItemComponent({ story, comments }),
    })}
  `
}

export default Item
