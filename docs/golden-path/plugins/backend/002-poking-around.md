---
id: poking-around
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

Before we jump in to making this plugin ready to ship, let's walk through how to run it locally. If you open your backend plugin's manifest (`plugins/todo-backend/package.json`), and look at the `scripts` section, you'll notice a few important commands. The ones relevant to us right now are

1. `yarn start` - Starts a local development server using the content in `dev/index.ts` as the backend.
2. `yarn test` - Runs all of the tests for your backend plugin.

If you run `yarn start`, you should see a custom backend for just your plugin start up. This will simplify plugin development and iteration for you or your team by easily testing out new features in just your plugin - just make sure you add what you need to the global `packages/backend`. The important log for us to look for is

```
2025-06-08T16:14:53.229Z rootHttpRouter info Listening on :7007
```

This indicates that your HTTP server is up and running and we can start sending test HTTP requests. Grab your favorite HTTP client and let's get testing!

To start, let's make sure we're starting from a clean slate. You can list all existing TODOs by running the command below. You should get back an empty list:

```sh
curl http://localhost:7007/api/todo/todos
```

To create a new TODO, you can send a POST request to the same endpoint. However, you will get a 401 error right now.

```sh
curl -X POST http://localhost:7007/api/todo/todos \
-H 'Content-Type: application/json; charset=utf-8' \
--data-binary @- << EOF
{
    "title": "My Todo",
}
EOF
```

The 401 error is because we track the ID of the user that created each TODO. If you send a request to create a TODO but don't provide an `Authentication` header, you will see this failure. For plugins that have a frontend as well, this credential management should happen automatically. Let's try this:

```sh
curl -v -X POST http://localhost:7007/api/todo/todos \
-H 'Content-Type: application/json; charset=utf-8' \
-H "Authorization: Bearer $(curl -s http://localhost:7007/api/auth/guest/refresh | jq -r '.backstageIdentity.token')" \
--data-binary @- << EOF
{
    "title": "My Todo"
}
EOF
```

We can then list all TODOs to see our new TODO!

```sh
curl http://localhost:7007/api/todo/todos
```

You'll notice that `createdBy` is `user:development/guest` which is the token we used to create the TODO. That's the `-H "Authorization: Bearer $(curl -s http://localhost:7007/api/auth/guest/refresh | jq -r '.backstageIdentity.token')"` part of the request.
