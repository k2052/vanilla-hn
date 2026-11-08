import CommentForm from './CommentForm'
import Story from './Story'
import StoryComment from './StoryComment'

const StoryItem = ({ story, comments }) => {
  let commentsMarkup = ''
  comments.forEach((comment) => {
    commentsMarkup += StoryComment({ ...comment })
  })

  return `
    <div class="StoryItem">
      ${Story({ ...story })}
      <div class="form">
        ${CommentForm()}
      </div>
      <div class="comments">
        ${commentsMarkup}
      </div>
  </div>
  `
}

export default StoryItem
