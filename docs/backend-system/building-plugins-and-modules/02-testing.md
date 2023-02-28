---
id: testing
title: Testing Backend Plugins and Modules
sidebar_label: Testing
# prettier-ignore
description: Learn how to test your backend plugins and modules
---

> **DISCLAIMER: The new backend system is in alpha, and still under active development. While we have reviewed the interfaces carefully, they may still be iterated on before the stable release.**

Utilities for testing backend plugins and modules are available in
`@backstage/backend-test-utils`. This section describes those facilities.

## Testing Backend Plugins and Modules

To facilitate testing of backend plugins and modules, the
`@backstage/backend-test-utils` package provides a `startTestBackend` function
which starts up an entire backend harness, complete with a number of mock
services. You can then provide overrides for services whose behavior you need to
adjust for the test run. The function also accepts a number of _features_ (a
collective term for backend [plugins](../architecture/04-plugins.md) and
[modules](../architecture/06-modules.md)), that are the subjects of the test.

The function returns an HTTP server instance which can be used together with
e.g. `supertest` to easily test the actual REST service surfaces of plugins who
register routes with [the HTTP router service
API](../core-services/01-index.md).

```ts
import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import request from 'supertest';
import { myPlugin } from './plugin.ts';

describe('myPlugin', () => {
  it('can serve values from config', async () => {
    const fakeConfig = { myPlugin: { value: 7 } };

    const { server } = await startTestBackend({
      features: [myPlugin()],
      services: [mockServices.config.factory({ data: fakeConfig })],
    });

    const response = await request(server).get('/api/example/get-value');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ value: 7 });
  });
});
```

This example shows how to access the mock service factories and
pass options to them, which will override the default mock services.

The returned server also has a `port()` method which returns the dynamically
bound listening port. You can use this to perform lower level network
interactions with the running test service.

## Testing Remote Service Interactions

If your backend plugin or service interacts with external services using HTTP
calls, we recommend leveraging the `msw` package to intercept actual outgoing
requests and return mock responses. This lets you stub out remote services
rather than the local clients, leading to more thorough and robust tests. You
can read more about how it works [in their documentation](https://mswjs.io/).

The `@backstage/backend-test-utils` package exports a `setupRequestMockHandlers`
function which ensures that the correct `jest` lifecycle hooks are invoked to
set up and tear down your `msw` instance, and enables the option that completely
rejects requests that don't match one of your mock rules. This ensures that your
tests cannot accidentally leak traffic into production from tests.

Example:

```ts
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

describe('read from remote', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  it('should auth and read successfully', async () => {
    expect.assertions(1);

    worker.use(
      rest.get('https://remote-server.com/api/v3/foo', (req, res, ctx) => {
        expect(req.headers.get('authorization')).toBe('Bearer fake');
        return res(
          ctx.status(200),
          ctx.set('Content-Type', 'application/json'),
          ctx.body(JSON.stringify({ value: 7 })),
        );
      }),
    );

    // exercise your plugin or service as usual, with real clients
  });
});
```

## Testing Database Interactions

The `@backstage/backend-test-utils` package includes facilities for testing your
plugins' interactions with databases, including spinning up `testcontainers`
powered Docker images with real database engines to connect to.

The base setup for such a test could look as follows:

```ts
// MyDatabaseClass.test.ts
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { MyDatabaseClass, type FooTableRow } from './MyDatabaseClass';

describe('MyDatabaseClass', () => {
  // Change this to the set of constants that you actually actively intend to
  // support. This create call must be made inside a describe block. Make sure
  // to create only one TestDatabases instance per file, since spinning up
  // "physical" databases to test against is much costlier than creating the
  // "logical" databases within them that the individual tests use.
  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  // Just an example of how to conveniently bundle up the setup code
  async function createSubject(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    const subject = new MyDatabaseClass({ database: knex });
    await subject.runMigrations();
    return { knex, subject };
  }

  describe('foo', () => {
    // Easily run the exact same test onto all supported databases
    it.each(databases.eachSupportedId())(
      'should run foo on %p',
      async databaseId => {
        const { knex, subject } = await createSubject(databaseId);
        // raw knex is available for underlying manipulation
        await knex<FooTableRow>('foo').insert({ value: 2 });
        // drive your system under test as usual
        await expect(subject.foos()).resolves.toEqual([{ value: 2 }]);
      });
  });
```

If you want to pass the test database instance into backend plugins or services,
you can supply it in the form of a mock instance of `coreServices.database` to
your test database.

```ts
const { knex, subject } = await createSubject(databaseId);
const { server } = await startTestBackend({
  features: [myPlugin()],
  services: [[coreServices.database, { getClient: async () => knex }]],
});
```

When running locally, the tests only run against SQLite for the sake of speed.
When the `CI` environment variable is set, all given database engines are used.

If you do not want or are unable to use docker based database engines, e.g. if
your CI environment is able to supply databases natively, the `TestDatabases`
support custom connection strings through the use of environment variables that
it'll take into account when present.

- `BACKSTAGE_TEST_DATABASE_POSTGRES13_CONNECTION_STRING`
- `BACKSTAGE_TEST_DATABASE_POSTGRES9_CONNECTION_STRING`
- `BACKSTAGE_TEST_DATABASE_MYSQL8_CONNECTION_STRING`
