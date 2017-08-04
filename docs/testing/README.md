# Testing the things [WIP Section]

## Testing Events

Since events are just object literals we test them like we would test object literals. For example, if we had a postComment event we could test it like this:

```js
test('postComment should return a payload with text and user details', => {
  const event = postComment({
    text: "Happens to me all the time. Don't worry about it. "
    user: {
      name: 'Bing Bong',
      id; 'A113',
    }
  })
  expect(Object.keys(event.payload).sort()).toEqual(['text', 'user'])
})
```
