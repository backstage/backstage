# Testing

Read when adding a plugin smoke test, or when components and hooks under test need APIs. For the general testing utilities, see [Testing frontend plugins](https://backstage.io/docs/frontend-system/building-plugins/testing) and [Testing with utility APIs](https://backstage.io/docs/frontend-system/utility-apis/testing).

Import test helpers from `@backstage/frontend-test-utils`, not `@backstage/test-utils`, which is for the old frontend system. Use its `mockApis`, `TestApiProvider`, `renderInTestApp`, and `renderTestApp` instead of writing API mocks or app wrappers by hand.

## Add a plugin smoke test

A smoke test installs the plugin in a test app, opens its main page, and checks that the page's content renders. It catches a missing default export, duplicate extension names, and APIs the page needs but nobody provides.

```tsx
// src/plugin.test.tsx
import { renderTestApp } from '@backstage/frontend-test-utils';
import { screen } from '@testing-library/react';
import myPlugin from '.';
import { devApis } from '../dev/devApis';

describe('my-plugin', () => {
  it('is the default export', () => {
    expect(myPlugin.id).toBe('my-plugin');
  });

  it('renders its main page', async () => {
    renderTestApp({
      features: [myPlugin, devApis],
      initialRouteEntries: ['/my-plugin'],
    });

    expect(await screen.findByText('My Plugin content')).toBeInTheDocument();
  });
});
```

- Import the plugin from the package entry (`.`), not from `./plugin`, so a missing default export fails the test.
- Reuse the dev app's API module (see [Dev app](dev-app.md)), or pass fakes with the `apis` option. Leave out `devApis` if the plugin has none.
- **Assert on content the page renders.** When a page throws, for example with `NotImplementedError` for a missing API, the extension's error boundary renders an error panel instead and the test still passes. An assertion like "renders without crashing" proves nothing.
- The test app does not report app startup errors such as `API_FACTORY_CONFLICT` or `EXTENSION_IGNORED`. Check those in the dev app's console (see [Troubleshooting](troubleshooting.md)).

To test a single extension in isolation instead of the whole plugin, use `createExtensionTester`.

## Provide APIs to components and hooks

Pass fakes with the `apis` option of `renderInTestApp`, or wrap hooks in `TestApiProvider`. Use the `mockApis` helpers for core APIs. See [Testing with utility APIs](https://backstage.io/docs/frontend-system/utility-apis/testing). To test analytics events, see the `plugin-analytics-instrumentation` skill.
