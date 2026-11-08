import { once } from './db'
import { transform } from './getItem'

const getStories = async (
  type = 'topstories',
  { page = 1, max = 30, api } = {},
) => {
  const pageNumber = Math.max(1, Math.floor(Number(page) || 1))
  const pageSize = Math.max(1, Math.floor(Number(max) || 30))
  const start = pageSize * (pageNumber - 1)
  const end = start + pageSize

  const ids = (await once(type, { api })) || []

  const stories = await Promise.all(
    ids.slice(start, end).map((id) => once(`item/${id}`, { api })),
  )

  return stories.filter(Boolean).map((obj) => transform(obj))
}

export default getStories
