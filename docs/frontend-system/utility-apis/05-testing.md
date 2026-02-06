---
id: testing
title: Testing with Utility APIs
sidebar_label: Testing
description: Mocking and testing Utility APIs
---

When testing frontend components and extensions, you often need to provide mock implementations of the utility APIs they depend on. The `@backstage/frontend-test-utils` package provides the `mockApis` namespace with ready-made mocks for all core utility APIs.

## The `mockApis` namespace

The `mockApis` namespace is the main entry point for creating mock utility API instances in tests. It provides two usage patterns for each API:

### Fake instances

Call the API function directly to create a fake instance with simplified but functional behavior. These are useful when your test needs the API to actually work, not just be stubbed.

```ts
import { mockApis } from '@backstage/frontend-test-utils';

const configApi = mockApis.config({ data: { app: { title: 'Test' } } });
configApi.getString('app.title'); // 'Test'

const alertApi = mockApis.alert();
alertApi.post({ message: 'hello' });
expect(alertApi.getAlerts()).toHaveLength(1);
```

### Jest mocks

Call `.mock()` to get an instance where every method is a `jest.fn()`. You can optionally provide partial implementations. This is useful when you want to assert that specific methods were called.

```ts
import { mockApis } from '@backstage/frontend-test-utils';

const catalogApi = mockApis.permission.mock({
  authorize: async () => ({ result: AuthorizeResult.ALLOW }),
});

// ... exercise the component ...

expect(catalogApi.authorize).toHaveBeenCalledTimes(1);
```

## Providing mock APIs in tests

### With `renderInTestApp`

```tsx
import { screen } from '@testing-library/react';
import { renderInTestApp, mockApis } from '@backstage/frontend-test-utils';

await renderInTestApp(<MyComponent />, {
  apis: [
    mockApis.identity({ userEntityRef: 'user:default/guest' }),
    mockApis.config({ data: { app: { title: 'Test App' } } }),
  ],
});
```

You can also use the `[apiRef, implementation]` tuple syntax to provide any API implementation, including ones that aren't from `mockApis`:

```tsx
import { myCustomApiRef } from '../apis';

const myCustomApiInstance = {
  // ...
};

await renderInTestApp(<MyComponent />, {
  apis: [
    mockApis.identity({ userEntityRef: 'user:default/guest' }),
    [myCustomApiRef, myCustomApiInstance],
  ],
});
```

### With `renderTestApp`

The same `apis` option is available on `renderTestApp`, which is commonly used when testing extensions or entity pages:

```tsx
import { renderTestApp, mockApis } from '@backstage/frontend-test-utils';
import { createTestEntityPage } from '@backstage/plugin-catalog-react/testUtils';

renderTestApp({
  extensions: [createTestEntityPage({ entity }), myEntityCard],
  apis: [mockApis.permission()],
});
```

### With `TestApiProvider`

For standalone rendering scenarios where you're not using `renderInTestApp`, the `TestApiProvider` component accepts the same `apis` format:

```tsx
import { render } from '@testing-library/react';
import { TestApiProvider, mockApis } from '@backstage/frontend-test-utils';

render(
  <TestApiProvider
    apis={[
      mockApis.identity({ userEntityRef: 'user:default/guest' }),
      mockApis.alert(),
    ]}
  >
    <MyComponent />
  </TestApiProvider>,
);
```

## Plugin-specific test mocks

Plugins can provide their own mock APIs that follow the same pattern. For example, `@backstage/plugin-catalog-react` provides `catalogApiMock` in its `/testUtils` entry point:

```tsx
import { renderTestApp } from '@backstage/frontend-test-utils';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

renderTestApp({
  extensions: [myExtension],
  apis: [catalogApiMock({ entities: [entity] })],
});
```

### Creating your own mock APIs with `attachMockApiFactory`

If you maintain a plugin that exposes a utility API, you can use `attachMockApiFactory` to create mock instances that can be passed directly to test utilities:

```ts
import { attachMockApiFactory } from '@backstage/frontend-test-utils';
import { myApiRef, type MyApi } from '@internal/plugin-example-react';

export function myApiMock(options?: { greeting?: string }): MyApi {
  const instance: MyApi = {
    greet: async () => options?.greeting ?? 'Hello!',
  };
  return attachMockApiFactory(myApiRef, instance);
}
```

Consumers can then use it like the built-in mocks:

```tsx
await renderInTestApp(<MyComponent />, {
  apis: [myApiMock({ greeting: 'Hi there!' })],
});
```

## Available mock APIs

The table below lists all core APIs available through the `mockApis` namespace.

| API                               | Fake instance         | Notes                                                                  |
| --------------------------------- | --------------------- | ---------------------------------------------------------------------- |
| `mockApis.alert()`                | `MockAlertApi`        | Collects alerts; has `getAlerts()`, `clearAlerts()`, `waitForAlert()`  |
| `mockApis.analytics()`            | `MockAnalyticsApi`    | Collects events; has `getEvents()`                                     |
| `mockApis.config({ data })`       | `MockConfigApi`       | Reads from a plain JSON object                                         |
| `mockApis.discovery({ baseUrl })` | Inline                | Returns `${baseUrl}/api/${pluginId}`, defaults to `http://example.com` |
| `mockApis.error(options?)`        | `MockErrorApi`        | Collects errors; has `getErrors()`, `waitForError()`                   |
| `mockApis.featureFlags(options?)` | `MockFeatureFlagsApi` | In-memory flag state; has `getState()`, `setState()`, `clearState()`   |
| `mockApis.fetch(options?)`        | `MockFetchApi`        | Wraps `cross-fetch`; supports identity injection and plugin protocol   |
| `mockApis.identity(options?)`     | Inline                | Configurable user ref, ownership, token, profile                       |
| `mockApis.permission(options?)`   | `MockPermissionApi`   | Defaults to `ALLOW`; accepts a handler function                        |
| `mockApis.storage({ data })`      | `MockStorageApi`      | In-memory storage with bucket support                                  |
| `mockApis.translation()`          | `MockTranslationApi`  | Passthrough returning default messages from translation refs           |

Each of these also has a `.mock()` variant that returns jest mocks, as described above.
