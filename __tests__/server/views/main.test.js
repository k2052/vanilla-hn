import chai, { expect as chaiExpect } from 'chai'
import cheerio from 'cheerio'
import chaiCheerio from 'chai-cheerio'
import view from '../../../src/server/views/main'

chai.use(chaiCheerio)

test('the view should return html with content in the app div', () => {
  const content = 'cats'
  const result = cheerio.load(view({ content }))
  chaiExpect(result('#app')).to.have.text('cats')
})
