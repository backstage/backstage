---
id: testing
title: Testing with Utility APIs
sidebar_label: Testing
description: Mocking and testing Utility APIs
---

The `mockApis` namespace from `@backstage/frontend-test-utils` provides test
implementations of the core Utility APIs. Every member of `coreApis` has a
matching `mockApis.<name>.mock()` helper. Some APIs also have functional fake
instances for tests that need state or other behavior.

## Create Jest mocks

Call `.mock()` to create an API whose methods are plain `jest.fn()` functions.
They have no implementation by default and return `undefined`. Configure the
methods your test uses by passing partial implementations:

```ts
import { mockApis } from '@backstage/frontend-test-utils';

const discovery = mockApis.discovery.mock({
  getBaseUrl: async pluginId => `http://example.com/api/${pluginId}`,
});

await discovery.getBaseUrl('catalog'); // 'http://example.com/api/catalog'
expect(discovery.getBaseUrl).toHaveBeenCalledWith('catalog');
```

All methods remain Jest mocks, including those supplied as partial
implementations. You can change their behavior and make assertions using the
usual Jest methods:

```ts
discovery.getBaseUrl.mockResolvedValue('http://other.example.com/catalog');
await expect(discovery.getBaseUrl('catalog')).resolves.toBe(
  'http://other.example.com/catalog',
);
expect(discovery.getBaseUrl).toHaveBeenCalledTimes(2);
```

Each call to `.mock()` creates an independent instance. Use mocks when your test
needs to control responses, simulate failures, or inspect calls.

## Provide APIs to components and extensions

Pass mocks directly to `renderInTestApp`, `renderTestApp`, or `TestApiProvider`.
The helpers associate each instance with its API ref, so you do not need to
provide the ref separately.

```tsx
import { renderInTestApp, mockApis } from '@backstage/frontend-test-utils';

const discovery = mockApis.discovery.mock({
  getBaseUrl: async () => 'http://example.com/api/catalog',
});

await renderInTestApp(<MyComponent />, { apis: [discovery] });
```

For extensions, use the same `apis` option:

```tsx
import { renderTestApp, mockApis } from '@backstage/frontend-test-utils';

renderTestApp({
  extensions: [myExtension],
  apis: [mockApis.permission()],
});
```

For standalone component rendering, wrap the component in `TestApiProvider`:

```tsx
import { render } from '@testing-library/react';
import { TestApiProvider, mockApis } from '@backstage/frontend-test-utils';

render(
  <TestApiProvider apis={[mockApis.identity({ displayName: 'Test User' })]}>
    <MyComponent />
  </TestApiProvider>,
);
```

You can also provide any API implementation as an `[apiRef, implementation]`
tuple. Mocks, fakes, and tuples can be mixed in the same `apis` array:

```tsx
await renderInTestApp(<MyComponent />, {
  apis: [discovery, [myCustomApiRef, myCustomApiInstance]],
});
```

### Test app defaults

`renderInTestApp` and `renderTestApp` provide in-memory fakes for alerts,
errors, OAuth requests, storage, and toast notifications. For example,
storage stays local to each test app, and posting a toast records a message
without displaying a notification. Explicit entries in `apis` replace these
defaults. The test app configures its error fake with `collect: true` to record
errors without displaying alerts or installing global error handlers.

Feature-provided API extensions can also override these defaults. APIs that
depend on installed extensions and app wiring use the test app's
implementations, so routes, theme providers, translations, and plugin
customizations remain available.

## Use functional fake instances

Call an API helper directly, without `.mock()`, to create a functional fake.
Fakes implement useful behavior, such as collecting notifications or updating
in-memory state. Their methods are ordinary functions, so assert on the resulting
state instead of using Jest call assertions.

```ts
const language = mockApis.appLanguage({ availableLanguages: ['en', 'sv'] });
language.setLanguage('sv');
expect(language.getLanguage()).toEqual({ language: 'sv' });

const toast = mockApis.toast();
const handle = toast.post({ title: 'Saved' });
expect(toast.getToasts()).toEqual([{ title: 'Saved' }]);
handle.close();
expect(toast.getToasts()).toEqual([]);
```

Fakes can be registered in the same way as Jest mocks:

```tsx
await renderInTestApp(<MyComponent />, {
  apis: [mockApis.config({ data: { app: { title: 'Test App' } } }), toast],
});
```

### Available fake instances

| Helper                                      | Behavior                                                                                                                                                               |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mockApis.alert()`                          | Collects alerts; provides `getAlerts()`, `clearAlerts()`, and `waitForAlert()`                                                                                         |
| `mockApis.analytics()`                      | Collects analytics events; provides `getEvents()`                                                                                                                      |
| `mockApis.appLanguage(options?)`            | Selects from `availableLanguages`, starting with `defaultLanguage` or English. Updates subscribers when the language changes; passing no language resets the selection |
| `mockApis.appLifecycle(options?)`           | Starts finalized unless `finalized: false` is supplied. `setFinalized()` changes state and notifies subscribers                                                        |
| `mockApis.appTheme(options?)`               | Exposes the supplied `themes` and optional `activeThemeId`. Theme selection updates subscribers without browser storage                                                |
| `mockApis.config({ data })`                 | Reads configuration from a plain JSON object                                                                                                                           |
| `mockApis.discovery({ baseUrl })`           | Returns `${baseUrl}/api/${pluginId}`, with `http://example.com` as the default base URL                                                                                |
| `mockApis.error(options?)`                  | Throws on unexpected errors by default. With `collect: true`, collects errors through `getErrors()` and `waitForError()`                                               |
| `mockApis.featureFlags(options?)`           | Maintains flag state in memory; provides `getState()`, `setState()`, and `clearState()`                                                                                |
| `mockApis.fetch(options?)`                  | Wraps native `fetch`; supports identity injection and the plugin protocol                                                                                              |
| `mockApis.icons({ icons })`                 | Looks up the supplied icon elements by key; defaults to an empty collection                                                                                            |
| `mockApis.identity(options?)`               | Provides configurable user identity, ownership, credentials, and profile information                                                                                   |
| `mockApis.oauthRequest()`                   | Coordinates pending OAuth requests and merges requested scopes. Subscribers to `authRequest$()` trigger or reject requests                                             |
| `mockApis.permission(options?)`             | Defaults to `ALLOW`; accepts a fixed authorization result or a handler                                                                                                 |
| `mockApis.pluginHeaderActions({ actions })` | Looks up arrays of header actions by plugin ID; defaults to an empty collection                                                                                        |
| `mockApis.storage({ data })`                | Maintains storage in memory, including separate buckets                                                                                                                |
| `mockApis.toast()`                          | Collects active toast messages through `getToasts()`. Handles dismiss individual messages; timeouts are not scheduled                                                  |
| `mockApis.translation()`                    | Returns default messages from translation refs                                                                                                                         |

The `permission` helper is for the permission plugin's API, which is defined
outside `coreApis`.

## Plugin-specific test helpers

Plugins can provide their own helpers. For example, `@backstage/plugin-catalog-react`
provides `catalogApiMock` in its `/testUtils` entry point:

```tsx
import { renderTestApp } from '@backstage/frontend-test-utils';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

renderTestApp({
  extensions: [myExtension],
  apis: [catalogApiMock({ entities: [entity] })],
});
```

### Create your own helpers

Use `createApiMock` to associate an API ref with a factory of plain Jest stubs.
Use `attachMockApiFactory` to associate the same ref with a functional fake:

```ts
import {
  attachMockApiFactory,
  createApiMock,
} from '@backstage/frontend-test-utils';
import { myApiRef } from '@internal/plugin-example-react';

export function myApiMock(options?: { greeting?: string }) {
  return attachMockApiFactory(myApiRef, {
    greet: async () => options?.greeting ?? 'Hello!',
  });
}

export namespace myApiMock {
  export const mock = createApiMock(myApiRef, () => ({ greet: jest.fn() }));
}
```

Both variants can then be passed directly to the test utilities' `apis` option.
