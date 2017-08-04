import db from './db'

const transform = val => (
  {
    id: val.id,
    url: val.url,
    user: val.by,
    // time is seconds since epoch, not ms
    date: new Date(val.time * 1000),
    // sometimes `kids` is `undefined`
    comments: val.kids || [],
    commentsCount: val.descendants,
    score: val.score,
    title: val.title,
  }
)

const observe = (id, fn) => {
  const onval = data => fn(transform(data.val()))
  const item = db
    .child('item')
    .child(id)
  item.on('value', onval)
  return () => item.off('value', onval)
}

const getItem = async (id) => {
  const item = await db
    .child('item')
    .child(id)
    .once('value')
  const val = item.val()
  if (val) {
    return transform(val)
  }

  return null
}

export default getItem

export {
  transform,
  observe,
}
