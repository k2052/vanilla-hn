# Events

Events are [flux standard actions](https://github.com/acdlite/flux-standard-action). I called them events because that makes more sense in the app. Events are JavaScript objects that contain a `type` and `payload` key. The type should be a constant and the payload should be an object containing the data from the event.

They look like this:

```js
const routeChange = url => (
  {
    type: ROUTE_CHANGE,
    payload: {
      url,
    },
  }
)
```

## Writing an Event

An event consists of two main parts; the type and an event creator. The type is a constant string. The creator is a function that returns a JS object literal.

Let's create a new event for handling posting a comment. First, let's declare the type by adding a new constant to src/universal/events/types/index.js:

```js
export const POST_COMMENT = 'POST_COMMENT'
```

Now let's add an event creator to src/universal/events/index.js:

```js
const postComment = comment => {
  return {
    type: POST_COMMENT,
    payload: {
      ...comment,
    }
  }
}
```

## Organizing Events By State

Placing all our events in a single file is good for such a tiny app but eventually we are going to need to scale up. What happens when we have 100s of events? How do we determine where events go and how do we maintain a mental model so it is intuitive?

The most common solution for splitting up code is to split by data type. For example, if we have a bunch of events related to Comments we would put them in events/comments. If we had a bunch of events related to Posts we would put them in events/posts. This works pretty well for most cases but what happens when we have so many events for each data type that even this model breaks down? How do we split events up further and in a consistent way?

We need a mental model for splitting up events that scales all the way. I like to organize events by the state they handle. For example, let's say we have a `editComment` event and the state shape for comments looks like this:

```js
{
  commentsById: {
    1: { }
  }
}
```

The event causes modifications to the comment inside of commentsById. If we created an event for this we would place it in `events/commentsById/comment`.

Organizing things by the state they manage is a clear mental model that works with the tiniest number of events, all the way up to thousands. It can feel a bit odd at first, but you quickly get used to it.

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

## Further Resources

Events are very much like Flux, it is intended that events in this app are a jumping off point into more standard terminology and implementations. You should totally go read about Flux, Redux, Flux standard actions and more!

- [Flux Standard Actions](https://github.com/acdlite/flux-standard-action)
- [Awesome Flux](https://github.com/yanmagale/awesome-flux)
