# Pages and Routes

Pages are async functions that eventually return a string of html. They gather up state and make requests for data from the Hacker News API, and then pass that data into a component. They look like this:

```js
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
```

## Writing a Page

There are two steps to writing a page;

1. Wrapping up a component in an async function
2. Adding the page to the routes file

Let's imagine we want a Jobs page that displays the "Who is Hiring" posts. The first thing we would need do is create a component called Jobs which takes in jobs and returns a representation of that state. Once that is done, create a new file in `src/universal/pages` called `Jobs`, with the following:

```js
import Page from '../components/Page'
import Stories from '../components/Stories'
import getStories from '../lib/getStories'

const getInitialProps = async ({ query }) => {
  const { p } = query
  const page = Number(p || 1)
  const stories = await getStories('jobstories', { page })
  return { page, stories }
}

const Jobs = async ({ query }) => {
  const { page, stories } = await getInitialProps({ query })
  const offset = (page - 1) * 30
  return `
    ${Page({
      children: Stories({ page, offset, stories }),
    })}
  `
}

export default Jobs
```

*Note*: We put all our logic for retrieving stories into a separate function called `getInitialProps`.

After we create our page we only need to add it to the routes file, e.g:

```js
import Jobs from '../pages/Jobs'

const routes = {
  '/jobs': Jobs,
}
```

## Testing a Page

Because a Page returns HTML you can test it like you would an HMTL string. Imagine for example, we have a page of stories and want to check that 25 stories are returned. Our test would look like this:

```js
test('Newest page returns 25 recent stories', async() => {
  const content = await Newest()
  const result = cheerio.load(content)
  expect(result('.stories').length).toEqual(25)
})
```
