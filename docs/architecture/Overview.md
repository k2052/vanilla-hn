# Overview: The Application Flow

Let's take a look at how a typical request and subsequent actions flow through the app. Let's imagine the following scenario:

1. Human opens the homepage
2. Human clicks on a story
3. Human toggles a comment

## The Request Hits The Server

The first thing that happens is the Koa app recieves a request for `/`. This is dispatched to the store which adds the request path and query to the state. The state is then passed into a view function which loads routes and matches those routes to Pages. Pages are async functions that return components after gathering up the state they need.

The root page component (src/universal/pages/News.js) makes a request to the Firebase HN api and retrieves the top 25 stories. Then it passes these stories into a Stories component and returns it. The Koa app then takes the resulting string and passes it into a view wrapper that contains the meta, tags, header, body tag etc.

It all works very much like universal React rendering only without the React.

## The Client Code

Once the page has loaded the client code initializes the store, hooks up the Sagas, and starts listening for page changes. When the app is rendered statically this step is hit first.

When a human clicks a story, a `routeChange` event is dispatched, the new state is then passed into a view function. The view function matches a route to a Page. The Page populates new state with the data it needs and then the new state triggers a re-render of the app using innerHTML.

Now the human toggles a comment, this dispatches a `toggleComment` event on the store, which is then passed to sagas, until the event is processed by a toggleComment saga. The toggleComment saga does two things;

1. yields effects with change the state of toggledComments
2. yields a toggleComment effect which re-renders the comment using InnerHTML
