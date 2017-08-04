import Story from './Story'
import Link from './Link'

const Item = ({ offset, i, story }) => {
  const offsetMarkup = `<span class="count">${i + offset + 1}</span>`

  return `
    <div class="item">
        ${offsetMarkup}
        <div class="story">
          ${Story({ ...story })}
        </div>
    </div>
  `
}

const Stories = ({ stories, page = 1, offset }) => {
  let storiesMarkup = ''
  stories.forEach((story, i) => {
    storiesMarkup += Item({ story, i, offset })
  })

  return `
    <div>
      ${storiesMarkup}
      <footer class="footer">
        ${Link({
          href: `/news?page=${page + 1}`,
          children: 'More',
        })}
      </footer>
    </div>
  `
}

export default Stories
