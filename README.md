# Vanilla JavaScript Hacker News

This is a Hacker News client in plain vanilla JavaScript. It depends on zero frontend frameworks. There is no React, no Vue, no Ember, just modern JavaScript.

- Uses zero frameworks on the client side
- Fully universal with server side rendering and state hydration
- An architecture much like a modern React stack

It takes many modern web-dev ideas and uses non-framework solutions to implement them. For JSX like templates, it uses template strings. For components, it uses functions that return template strings. For data-flow and effects, it uses async generators. For routing, it uses a simple switchPath function that matches a route to an async function that returns a component. The architecture is designed to reveal the problems that frameworks like React were built to solve.  

*Note*: This is meant as a learning example and I highly recommend you use a framework in real world applications.

## Installation

You can install all the dependencies by running:

```sh
$ yarn install
```

## Usage

### Running The App

You can start up a dev server by running:

```sh
$ yarn run dev
```

This will boot up [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) on port 9000. There is no hot-reloading but the page will refresh when there are changes.

You can start the production server by running start:

```sh
$ yarn run start
```

### Building

You can build the dev version of the app by running:

```sh
$ yarn run webpack
```

You can build the client by running

```sh
$ yarn run build.client
```

To build the server run:

```sh
$ yarn run build.server
```

### Tests

Tests are done using [Chai](http://chaijs.com) and [Jest](https://facebook.github.io/jest). You can run them like this:

```sh
$ yarn run test
```

*Note*: Run `$ yarn run build.client` the first time you run the tests or the test that tests assets are served will fail.

To get coverage details run:

```sh
$ yarn run coverage
```

### Deployment

The app is designed to be static and once built to dist it can be deployed pretty much anywhere. It also comes with a SSR version that can be deployed to any node host.

#### Deploying to Zeit

To deploy to Zeit run:

```sh
$ yarn run deploy.zeit
```

#### Deploying to GitHub

To deploy to GitHub run:

```sh
$ yarn run deploy.gh
```

## Architecture

The app is made up of components, events, and sagas.

The [components](https://github.com/k2052/vanilla-hn/blob/master/docs/architecture/Components.md) are functions that take state and return a string representation of that state. They are a lot like React components except they use template strings instead of JSX and they don't use a virtual DOM. Instead of a virtual DOM we use innerHTML and keep track of what state has changed and the corresponding component for that state.

The [events](https://github.com/k2052/vanilla-hn/blob/master/docs/architecture/Events.md) are a lot like Flux. They are plain objects that get passed into a [Store](https://github.com/k2052/vanilla-hn/blob/master/docs/architecture/Store.md); the store dispatches the events to Sagas to be processed and finally new state is generated which causes re-renders.

[Sagas](https://github.com/k2052/vanilla-hn/blob/master/docs/architecture/Sagas.md) are async generators that respond to actions by yielding [effects](https://github.com/k2052/vanilla-hn/blob/master/docs/architecture/Effects.md). Effects are where all the bad stuff is handled. They are where we do stuff that manipulates the state and the DOM.

You can read more about the app's architecture in the [docs](https://github.com/k2052/vanilla-hn/blob/master/docs/README.md)

## Known Issues

- Routes with the dev server are not universal i.e you can't bookmark a story and return to it -- a refresh returns a 404.
- Needs to hashes for pages (e.g #ask) on the static version so URLS like /ask don't 404

## Future Plans

- Improved loading indicators
- Login/Signup
- hot-reload
- Replace Koa usage with plain node http servers

## Credits

The design of this is a direct port of [next-news](https://next-news.now.sh)

## License

Licensed under MIT

## Hire Me

I'm looking for work! Drop me a line [k@2025.me](mailto:k@2052.me) if you are hiring.
