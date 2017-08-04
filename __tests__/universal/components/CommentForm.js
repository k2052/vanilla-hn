import chai, { expect as chaiExpect } from 'chai'
import cheerio from 'cheerio'
import chaiCheerio from 'chai-cheerio'
import view from '../../../src/universal/components/CommentForm'

chai.use(chaiCheerio)

test('it should render a comment form', () => {
  const content = 'cats'
  const result = cheerio.load(view({ content }))
  chaiExpect(result('.CommentForm button')).to.have.text('add comment')
})
