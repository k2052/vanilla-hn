import Page from '../components/Page'
import ItemComponent from '../components/StoryItem'
import getItem from '../lib/getItem'
import getComments from '../lib/getComments'

const getInitialProps = async ({ query: { id } }) => {
  const story = await getItem(id)
  const comments = await getComments(story.comments)
  return { story, comments, id }
}

const Item = async ({ req, query }) => {
  const { story, comments } = await getInitialProps({ req, query })
  return `
    ${Page({
      children: ItemComponent({ story, comments }),
    })}
  `
}

export default Item
