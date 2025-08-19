---
id: 002-poking-around
sidebar_label: 002 - Poking around
title: 002 - Poking around
---

## Default plugin functionality

By default, that plugin that you just created hosts a simple todo list application. It exposes an HTTP API at `http://localhost:7007/api/todo/todos` that allows you to create TODOs, list existing TODOs, and get a specific TODO. It stores those TODOs in memory, which means that you would lose all of your TODOs if you restarted your application. It also allows you to tag TODOs with a Software Catalog entity, which will be useful for our frontend integration.

To make this plugin production ready, we'll need to adjust a few things,

1. Write our TODOs to a database so they don't get lost on restart.
2. Write some proper tests to make sure everything works the way we expect.
3. Get user feedback.

## Testing locally

Before we jump in to making this plugin ready to ship, let's walk through how to run it locally. If you open your backend plugin's manifest (`plugins/todo-backend/package.json`), and look at the `scripts` section, you'll notice a few important commands. The ones relevant to use right now are

1. `yarn start` - Starts a local development server using the content in `dev/index.ts` as the backend.
2. `yarn test` - Runs all of the tests for your backend plugin.

If you run `yarn start`, you should see a custom backend for just your plugin start up. This will simplify plugin development and iteration for you or your team by easily testing out new features in just your plugin - just make sure you add what you need to the global `packages/backend`. The important log for us to look for is

```
2025-06-08T16:14:53.229Z rootHttpRouter info Listening on :7007
```

This indicates that your HTTP server is up and running and we can start sending test HTTP requests. Grab your favorite HTTP client and let's get testing! If you aren't sure what to use, I'd recommend the `humao.rest-client` VSCode extension which can easily be run in VSCode itself with very little extra set up.

```

```
