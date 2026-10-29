# Testing

Read when adding or changing tests for a backend plugin, module, service, or router.

`@backstage/backend-test-utils` has a helper for almost everything a backend test needs. Use it before writing a mock, a test database, a temporary directory, or an Express setup by hand. Hand-written mocks drift from the real service interfaces and miss behavior such as credential checks.

For full examples, see [Testing Backend Plugins and Modules](https://backstage.io/docs/backend-system/building-plugins-and-modules/testing).

## Pick the helper

| Need                                         | Use                                                                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Run a plugin or module with its dependencies | `startTestBackend({ features: [...] })`, then send requests to the returned `server` with `supertest`               |
| Replace a core service                       | `mockServices.<service>.factory(...)` for a working fake, `mockServices.<service>.mock(partialImpl)` for jest mocks |
| Credentials or `Authorization` headers       | `mockCredentials.user()`, `.service()`, `.none()`, and `mockCredentials.user.header()` for requests                 |
| A real database                              | `TestDatabases.create({ ids: [...] })` once per file, inside `describe`, then `databases.init(id)` in each test     |
| A real cache                                 | `TestCaches.create(...)`, following the same pattern as `TestDatabases`                                             |
| Files on disk                                | `createMockDirectory()`, then `setContent(...)` and `path` or `resolve(...)`                                        |
| HTTP calls to other services                 | `registerMswTestHooks(server)` with an MSW `setupServer()`                                                          |
| A router tested without a backend            | Add `router.use(mockErrorHandler())` so thrown errors become the same responses as in production                    |
| A single service factory                     | `ServiceFactoryTester.from(factory, { dependencies: [...] })`                                                       |
| Alpha services such as the actions registry  | The mocks from `@backstage/backend-test-utils/alpha`, for example `actionsRegistryServiceMock`                      |

## Traps

- **`startTestBackend` already provides mock core services.** Only pass the service factories whose behavior the test needs to change, such as `mockServices.rootConfig.factory({ data })`.
- **`.mock()` and `.factory()` do different things.** `mockServices.x.mock()` returns a service made of `jest.fn()` methods, and most of them return `undefined` unless you pass an implementation. `mockServices.x.factory()` installs a working fake implementation. Prefer `factory()` unless you need to assert on calls. To test a class outside a backend, many services also have a standalone fake, such as `mockServices.auth()` or `mockServices.database({ knex })`.
- **Create one `TestDatabases` instance per test file.** Starting a database engine is expensive. Run the same test on every engine with `it.each(databases.eachSupportedId())`. Locally only SQLite runs. When `CI` is set, every listed engine runs.
- **Use `mockCredentials` instead of building credential objects.** The default user is `user:default/mock`. Pass an entity ref to test a different user, and use `invalidHeader()` or `invalidToken()` to test rejection.
- **Pass a test database into a plugin through the database service.** Use `mockServices.database.factory({ knex })` with the `knex` instance from `databases.init(id)`.
