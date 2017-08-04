/**
 * Deploys to gh-pages
 */
const ghpages = require('gh-pages')

ghpages.publish('dist', (e) => {
  if (e) {
    console.log(e)
    return
  }

  console.log('published')
})
