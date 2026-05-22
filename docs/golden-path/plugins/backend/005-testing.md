---
id: testing
sidebar_label: 005 - Unit testing your plugin
title: 005 - Testing
description: How to write unit tests for your Backstage backend plugin
---

## Testing is important

We've done a lot of manual testing up to this point of functionality. Let's start putting those assumptions into code that we can run on every change to ensure things are working correctly.

The scaffolded plugin uses **Jest** as the test runner, **`supertest`** to drive HTTP traffic, and a few helpers from `@backstage/backend-test-utils`. We'll work outwards: start with a test for the router (the surface our users actually call), then a test for the whole plugin (so we cover wiring, migrations, and config), and finally pull in OpenAPI to validate that the responses we send match the spec we publish.

Run any of the snippets below from the repo root with:

```sh
yarn test plugins/todo-backend
```

## Router-level testing

Your scaffolded plugin already includes a `src/router.test.ts`. It spins up the router on top of a real Express app, then uses `supertest` to drive HTTP traffic through it:

```ts title="src/router.test.ts"
import { mockServices } from '@backstage/backend-test-utils';
import express from 'express';
import request from 'supertest';
import { createRouter } from './router';

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      httpAuth: mockServices.httpAuth(),
      todoList: {
        listTodos: jest.fn().mockResolvedValue({ items: [] }),
        getTodo: jest.fn(),
        createTodo: jest.fn(),
        syncTodosFromSource: jest.fn(),
      },
    });
    app = express().use(router);
  });

  it('returns the list of todos', async () => {
    const response = await request(app).get('/todos');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ items: [] });
  });
});
```

A few patterns worth internalising here:

1. **`mockServices` gives you fakes for every core service.** `mockServices.httpAuth()` defaults missing credentials to a mock user principal, so any handler that calls `httpAuth.credentials(req, { allow: ['user'] })` passes through without you having to set an `Authorization` header. Handlers that restrict to other principal types (e.g. `allow: ['service']`) will still throw — use `mockCredentials.none.header()` from `@backstage/backend-test-utils` to drive an explicitly unauthenticated request, or `mockServices.httpAuth.mock()` if you want a Jest mock you can assert on.
2. **The router takes its dependencies as plain objects.** Because `createRouter` accepts an interface rather than calling out to global state, we can pass an in-test object for `todoList` and stay laser-focused on routing concerns: status codes, query parsing, error mapping. The actual database, catalog, and SCM logic gets tested separately.
3. **Prefer fewer, thorough tests with multiple assertions.** Group a happy path, a 404, and a validation error in the same `describe` rather than splitting them across many tiny tests — it keeps the per-test setup small and the failures more informative.

This is a great place to test the router-only behaviour we added in earlier steps: that `POST /todos` rejects an empty body with a 400, that `GET /todos/:id` returns 404 when the service throws `NotFoundError`, and that `POST /todos/sync` requires user credentials.

## Plugin-level testing

Router tests give you fast feedback, but they don't exercise the bits of your plugin that live in `plugin.ts` — the `init` function, the migration runner, the service factory wiring. For those, reach for `startTestBackend`:

```ts title="src/plugin.test.ts"
import {
  mockCredentials,
  startTestBackend,
} from '@backstage/backend-test-utils';
import request from 'supertest';
import { todoPlugin } from './plugin';

describe('todoPlugin', () => {
  it('runs migrations and serves todos end-to-end', async () => {
    const { server } = await startTestBackend({
      features: [todoPlugin],
    });

    // The plugin's `init` ran migrations against an in-memory SQLite DB
    // before the server started accepting requests.
    const listResponse = await request(server).get('/api/todo/todos');
    expect(listResponse.status).toEqual(200);
    expect(listResponse.body).toEqual({ items: [] });

    const createResponse = await request(server)
      .post('/api/todo/todos')
      .set('Authorization', mockCredentials.user.header())
      .send({ title: 'A new todo' });
    expect(createResponse.status).toEqual(201);
    expect(createResponse.body).toMatchObject({ title: 'A new todo' });
  });
});
```

What you get for free with this:

1. **A real backend.** Your plugin is loaded the same way it loads in production: through the backend system, with all of its core services wired up (an in-memory SQLite database, an in-memory cache, mock HTTP auth, etc.).
2. **Migrations run automatically.** The migration code you wrote in step 003 actually executes here — if a migration is broken, this test fails before the first request ever reaches your router.
3. **Routes are mounted under `/api/<pluginId>`.** Tests hit the same paths real clients hit, which catches mistakes like a forgotten `pluginId` in `httpRouter.use`.

If your plugin depends on another (for example, a real catalog rather than the mock catalog service we passed in earlier), you can pass extra `features` to `startTestBackend` to compose them together. For most unit tests, though, mocking the dependency at the service level is faster and gives you better failure messages.

## OpenAPI testing

If you've followed the [OpenAPI getting-started guide](../../../openapi/01-getting-started.md) and have a spec at `src/schema/openapi.yaml`, you can have your test traffic double as a check that your responses actually match what your spec promises.

The trick is to wrap the express app with `wrapServer` from `@backstage/backend-openapi-utils/testUtils`. It boots a small in-process proxy that validates every request and response against your spec, then tears itself down via Jest's `afterAll`:

```diff title="src/router.test.ts"
- import express from 'express';
+ import express from 'express';
+ import { Server } from 'node:http';
+ import { wrapServer } from '@backstage/backend-openapi-utils/testUtils';

  describe('createRouter', () => {
-   let app: express.Express;
+   let app: Server;

    beforeAll(async () => {
      const router = await createRouter({ /* ... */ });
-     app = express().use(router);
+     app = await wrapServer(express().use(router));
    });
```

### Integration with Jest tests

You don't need a separate test command or a separate Jest configuration. With `wrapServer` in place, every `request(app)` call your existing router tests already make flows through the proxy and is checked against the OpenAPI schema served by the running app at `/openapi.json` (which may itself be generated from `src/schema/openapi.yaml`): the route has to exist in the spec, the status code has to be declared, and the response body has to satisfy the declared schema — including any `required` properties. A mismatch surfaces as a normal Jest failure on the test case that produced the bad response.

> `@backstage/backend-openapi-utils/testUtils` also exports `wrapInOpenApiTestServer`, which is a separate Optic-based integration that only validates when `OPTIC_PROXY` is set. For ordinary Jest tests, prefer `wrapServer`.

Because validation is real, **partial fixtures will fail the test, not silently pass.** A handler that returns `{} as TodoItem` will fail validation against a spec that requires `id`, `title`, `createdBy`, and `createdAt`. The fix is to populate fixtures fully:

```ts
const todo: TodoItem = {
  id: '11111111-1111-1111-1111-111111111111',
  title: 'A new todo',
  createdBy: 'user:default/guest',
  createdAt: '2026-01-01T00:00:00.000Z',
};
```

When a check fails, the cause is one of three things:

1. **The handler is wrong.** Your code returns something the spec doesn't allow. Fix the handler.
2. **The test fixture is wrong.** A mock returns a partial object that fails required-property checks. Populate the fixture fully, or if the field really is optional, mark it optional in the spec.
3. **The spec is wrong.** Update `src/schema/openapi.yaml` to match the response you actually want to ship, then re-run the test.
