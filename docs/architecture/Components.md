# Components

Components are functions that take in state and return a string representation of that state. They resemble React components but use template strings instead. They look like this:

```js
const Cats = cats => {
  const catsMarkup = ''

  cats.forEach((cat) {
    catsMarkup += Cat(cat)
  })

  return `
    <div class="Cats">
      Cats are awesome!
      <ul>${catsMarkup}</ul>
    </div>
  `
}
```

That is really all there is to them!

## Testing a Component

Since a component is just a representation of state in string form, we can test it using an HTML parser like cheerio. We pass in the state and then check the output is correct:

```js
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
```

## Composing Components

Using another component isn't as elegant as in JSX but it is still nice enough. The most straightforward way is to call it in the template string like this:

```js
const Cat = cat => {
  return `
  <div class="Cat">
    ${Tail(cat)}
  </div>
  `
}
```

### Children in Components

Imagine that you have a Article component and you want to pass it an article. We can do this by passing in a string to the component:

```js
const Article = ({ children }) => {
  return `
  <div class="Article">
    ${children}
  </div>
  `
}
```

## Context in Template Strings: Wrapping a Component

Let's imagine we have a comment component and every comment component needs access to the current user state. We could pass it directly in like this:

```js
const Story = ({ user }) => {
  return `
    ${comments.map((comment) => {
      `${Comment({ user, ...comment })}`
    })}
  `
}
```

This works in the simplest use case, but imagine if we had nested components. We'd have to pass user to every one of them, just so the Comment component could be get it.

Passing a huge chunk of state around to every component can get time consuming and messy. In the world of virtual DOM this is solved by attaching context to objects. How do we do the same thing when we are just working with strings? We can use two things;

1. A global store. (globals aren't as evil as you think)
2. A higher order function that localizes the global state

Let's use a higher order function. We can call this wrapper function wrap. It would look like this:

```js
const wrap = (paths, component) => {
  const wrapped = (state) => {
    const finalState = { ...state }
    Object.keys(paths).forEach((k) => {
      const path = paths[k]
      finalState[k] = window.store.state[path]
    })

    return component(finalState)
  }

  return wrapped
}
```

wrap takes some state keys and component, gathers up the state from the global store, and then returns a new function that passes it in locally.

Now if we wanted the user in our Comment component we could do this:

```js
const Comment = ({ user }) => {
  ...
}

export default wrap({
  user: 'user',
}, Comment)
```

## Communicating With The Store

Imagine we have a comment and we want to delete it. Three things happen in a comment deletion;

1. The delete button is clicked which calls a delete function
2. A deleteComment event is dispatched onto the store
3. The comment is removed from state and the DOM

How do we trigger things to happen and respond to those actions with side effects? Let's look at triggering actions first and then we will look at updating the DOM in response. To trigger an action we need some way to hook up the DOM and trigger the store. The first solution at this might look like:

```js
const DeleteButton = ({ id, dispatch }) => {
  const clickButton = () => {
    dispatch(deleteComment(id))  
  }

  return `
    <button onclick={clickButton()}>Delete Comment</button>
  `
}
```

If we try to use this button we will get nothing. This is because the function we are calling is assumed to be part of the window. There are lots of ways we can handle this;

1. We could create handlers outside of the component (e.g using event bubbling and checking the ID)
2. We can attach the function to window and give it a unique name
3. We can turn the template strings into DOM elements and then add the click handler to them

The second one is the approach I have chosen. It is not the most clean, but it should show you why the virtual DOM is such a logical approach. If we had objects instead of template strings we could parse and look for onclick attributes, then wire everything up.

How do we add a unique function to the window? We calculate an ID and then point the ID to our onclick handler:

```js
const clickButton = () => {
  dispatch(deleteComment(id))  
}

const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
const uniqid = randLetter + Date.now()
const fId = `fId${uniqid}`
window[fId] = clickButton
```

## Updating a Component

Reactivity is a central aspect of modern apps. The flow of state to views is a powerful abstraction, but re-rendering the entire app for every state change is not the most performant way to do things.

How do we re-render just a single part of the app without a virtual DOM?

The answer is we keep track of every bit of state that might change, its representation, and how to update the DOM with the new representation. If this sounds like a lot of boilerplate work, that is because it is. The abstraction of a virtual DOM allows you to do all of that automatically. That said, we can learn a ton from doing it manually.

Let's imagine that we have a Story and the story has comments. Every time a comment is toggled we want to re-render the comment. To do this we are going to need three things:

1. A comment view
2. A way to keep track of the comment's html in the DOM. An id is fine.
3. An effect that updates the comment's HTML

First let's create a Comment component:

```js
const StoryComment = ({ user, text, date, comments, id,
  parent = true, toggled = false, toggledComments, dispatch }) => {
  const toggle = () => { // eslint-disable-line
    dispatch(toggleComment({ user, text, date, comments, id }))
  }

  return `
    <div class="comment" id="comment-${id}">
      <div class="meta">
        ${user}
        ${timeAgo(new Date(date))} ago
        <span onClick="${toggleId}()" class="toggle">
          toggled
        </span>
      </div>
      ${body}
    </div>
  `
}
```

Now an effect

```js
const toggleComment = (comment) => {
  const effect = async (store) => {
    const { id } = comment
    const markup = StoryComment(comment)
    const elem = document.querySelector(`#comment-${id}`)
    elem.innerHTML = markup

    return store
  }

  effect.meta = {
    type: 'TOGGLE_COMMENT',
  }

  return effect
}
```

## Interactivity

A common mental hurdle in state -> view architectures is how do you add jQuery? If everything has to pass through state then how do we like animate things? Because our template strings are not a virtual DOM we don't need to make sure our renderer is aware we are doing bad things to the DOM, we can just do it. This is how you would use jQuery with one of our components:

```js
const Comment = ({ id }) => {
  const onclick = () => {
    // do things
  }

  $(`#${comment-$[id]}`).live('click', onclick)

  return `
    <div class="Comment" id="${comment-$[id]}"></div>
  `
}
```

## Further Resources

- [Template Strings Tutorial on GetGood.at](https://getGood.at/js/es6/templates)
- [Hyperx a Template Strings Virtual DOM](https://github.com/substack/hyperx)
- [React](https://facebook.github.io/react/)
