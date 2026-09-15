---
id: testing
title: Frontend System Testing Plugins
sidebar_label: Testing
description: Testing plugins in the frontend system
---

# Testing Frontend Plugins

Utilities for testing frontend features and components are available in `@backstage/frontend-test-utils`.

## Testing React components

A component can be used for more than one extension, and it should be tested independently of an extension environment.

Use the `renderInTestApp` helper to render a given component inside a Backstage test app:

```tsx
import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/frontend-test-utils';
import { EntityDetails } from './plugin';

describe('Entity details component', () => {
  it('should render the entity name and owner', async () => {
    await renderInTestApp(<EntityDetails owner="tools" name="test" />);

    await expect(
      screen.findByText('The entity "test" is owned by "tools"'),
    ).resolves.toBeInTheDocument();
  });
});
```

To mock [Utility APIs](../architecture/33-utility-apis.md) that are used by your component, pass API overrides to `renderInTestApp` using the `apis` option. Mock helpers are available from `@backstage/frontend-test-utils` and plugin-specific test utilities. For a deeper look at the available mock APIs and how to create your own, see [Testing with Utility APIs](../utility-apis/05-testing.md).

```tsx
import { screen } from '@testing-library/react';
import { renderInTestApp, mockApis } from '@backstage/frontend-test-utils';
import { identityApiRef } from '@backstage/frontend-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { MyEntitiesList } from './plugin';

describe('MyEntitiesList', () => {
  it('should render entities owned by the current user', async () => {
    await renderInTestApp(<MyEntitiesList />, {
      apis: [
        [
          identityApiRef,
          mockApis.identity({ userEntityRef: 'user:default/guest' }),
        ],
        [
          catalogApiRef,
          catalogApiMock({
            entities: [
              {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'Component',
                metadata: { name: 'my-component' },
                spec: { type: 'service', owner: 'user:default/guest' },
              },
            ],
          }),
        ],
      ],
    });

    await expect(
      screen.findByText('my-component'),
    ).resolves.toBeInTheDocument();
  });
});
```

This approach provides the API overrides at the app level, which is useful when testing components that depend on APIs deep in the component tree.

The `TestApiProvider` component is also available for standalone rendering scenarios where you're not using `renderInTestApp` or other test utilities. Context providers like `EntityProvider` from `@backstage/plugin-catalog-react` can also be used to provide a mocked entity context to the component.

## Testing extensions

To facilitate testing of frontend extensions, the `@backstage/frontend-test-utils` package provides a tester class which starts up an entire frontend harness, complete with a number of default features. You can then provide overrides for extensions whose behavior you need to adjust for the test run.

A number of features (frontend extensions and overrides) are also accepted by the tester. Here are some examples of how these facilities can be useful:

### Single extension

In order to test an extension in isolation, you can use `createExtensionTester` to create a tester instance and access the element that the extension outputs. This element can then be rendered as usual with `renderInTestApp`:

```tsx
import { screen } from '@testing-library/react';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import { indexPageExtension } from './plugin';

describe('Index page', () => {
  it('should render the index page', async () => {
    await renderInTestApp(
      createExtensionTester(indexPageExtension).reactElement(),
    );

    expect(screen.getByText('Index Page')).toBeInTheDocument();
  });
});
```

You can also provide API overrides directly to `createExtensionTester` using the `apis` option:

```tsx
import { screen } from '@testing-library/react';
import {
  createExtensionTester,
  mockApis,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import { identityApiRef } from '@backstage/frontend-plugin-api';
import { indexPageExtension } from './plugin';

describe('Index page', () => {
  it('should render with a custom identity', async () => {
    await renderInTestApp(
      createExtensionTester(indexPageExtension, {
        apis: [
          [
            identityApiRef,
            mockApis.identity({ userEntityRef: 'user:default/guest' }),
          ],
        ],
      }).reactElement(),
    );

    expect(screen.getByText('Index Page')).toBeInTheDocument();
  });
});
```

Note that the `.reactElement()` method will look for the `coreExtensionData.reactElement` data in the extension outputs. If that doesn't exist and the extension outputs something else that you want to test, you can access the output data using the `.get(dataRef)` method instead.

### Multiple extensions

In some cases you might need to test multiple extensions together, in particular when testing inputs. In this case, you can add more extensions to the tester instance using the `.add(...)` method. It also accepts an optional options object as the second argument, which you can use to provide configuration for the extension instance.

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import { indexPageExtension, indexPageHeader } from './plugin';

describe('Index page', async () => {
  it('should link to the index page with header', async () => {
    const tester = createExtensionTester(indexPageExtension)
      // Adding the header to be rendered on the index page
      .add(indexPageHeader);

    await renderInTestApp(tester.reactElement());

    await expect(screen.findByText('Index page')).toBeInTheDocument();
    await expect(screen.findByText('Index page header')).toBeInTheDocument();

    expect(
      tester.query(indexPageHeader).get(headerDataRef),
    ).toMatchObject(/* ... */);
  });
});
```

When testing multiple extensions you may sometimes want to access the output of other extensions than the main test subject. You can use the `.query(ext)` method to query a different extension that has been added to the tester, by passing the extension used with the `createExtensionTester(...).add(ext)`

### Setting configuration

In the case that your extension can be configured, you can test this capability by passing configuration values as follows:

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import { indexPageExtension, detailsPageExtension } from './plugin';

describe('Index page', () => {
  it('should accept a custom title via config', async () => {
    const tester = createExtensionTester(indexPageExtension, {
      // Extension configuration for the index page
      config: { title: 'Custom page' },
    }).add(indexPageHeader, {
      // Extension configuration for the index page header
      config: { title: 'Custom page header' },
    });

    await renderInTestApp(tester.reactElement(), {
      // Global configuration for the app
      config: {
        app: {
          title: 'Custom app',
        },
      },
    });

    await expect(screen.findByText('Custom app')).toBeInTheDocument();
    await expect(screen.findByText('Custom page')).toBeInTheDocument();
    await expect(screen.findByText('Custom page header')).toBeInTheDocument();
  });
});
```

## Testing entity extensions

The `createTestEntityPage` utility from `@backstage/plugin-catalog-react/testUtils` simplifies testing entity cards and content extensions. It creates a test page that mounts at `/`, provides an `EntityProvider` context, and picks up entity extensions through input redirects.

```tsx
import { screen } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import { createTestEntityPage } from '@backstage/plugin-catalog-react/testUtils';
import { myEntityCard } from './plugin';

describe('MyEntityCard', () => {
  it('should render for Component entities', async () => {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'my-service' },
      spec: { type: 'service', owner: 'team-a' },
    };

    renderTestApp({
      extensions: [createTestEntityPage({ entity }), myEntityCard],
    });

    expect(await screen.findByText('My Card Title')).toBeInTheDocument();
  });
});
```

Entity content extensions can be tested the exact same way, just pass your content extension instead of a card. The test page also supports entity filters defined on the extensions, so you can test filter behavior by providing different entity kinds. If your extension depends on APIs you can pass mock implementation using the `apis` option `renderTestApp`, or you can pass the API extension directly alongside your content extension.

Extensions that use `EntityRefLinks` or `useRelatedEntities` may require additional API mocking using the `apis` option on `renderTestApp`.

## Mounting routes

If your component or extension uses `useRouteRef` to generate links to other routes, you need to mount those routes in the test environment. Both `renderInTestApp` and `renderTestApp` support the `mountedRoutes` option for this purpose.

For example, given a component that uses `useRouteRef` to create a link:

```tsx
import { useRouteRef } from '@backstage/frontend-plugin-api';
import { detailsRouteRef } from './routes';

export const MyComponent = () => {
  const detailsLink = useRouteRef(detailsRouteRef);

  return <a href={detailsLink()}>View details</a>;
};
```

You can test it by mounting the route ref to a path using the `mountedRoutes` option:

```tsx
import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/frontend-test-utils';
import { detailsRouteRef } from './routes';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render a link to the plugin page', async () => {
    await renderInTestApp(<MyComponent />, {
      mountedRoutes: {
        '/my-plugin/details': detailsRouteRef,
      },
    });

    expect(await screen.findByText('View details')).toHaveAttribute(
      'href',
      '/my-plugin/details',
    );
  });
});
```

## Navigation and app history

`renderInTestApp` and `renderTestApp` set up an in-memory app history and return
it as `appHistory` on the render result. Use it to move the test app between
locations and to assert on where it ended up:

```tsx
import { act, screen } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import { toolsPage } from './alpha';

describe('Tools page', () => {
  it('should show the details view when navigating to it', async () => {
    const { appHistory } = renderTestApp({
      extensions: [toolsPage],
      initialRouteEntries: ['/tools'],
    });

    expect(await screen.findByText('All tools')).toBeInTheDocument();

    await act(async () => {
      appHistory.navigate('/tools/details');
    });

    expect(await screen.findByText('Tool details')).toBeInTheDocument();
  });
});
```

`appHistory.navigate` also takes a number, so `appHistory.navigate(-1)` walks
back through history the way a browser back button does. The current location is
readable as `appHistory.location`, observable through `appHistory.location$`, and
`appHistory.createHref` resolves a path the way a rendered link would.

Reach for this harness whenever the behavior under test depends on routing. If
you mock `AppHistoryApi` yourself, keep to its four members: `navigate`,
`location`, `location$`, and `createHref`.

## Routing library context in tests

`renderInTestApp` renders the element as a **page**. Registered page mounts
receive the same implicit React Router v6 compatibility as production. Test
parameters, relative links and nested content before and after adding an explicit
adapter. Development warnings identify consumers of the implicit fallback.

There are three answers, and which one is right depends on what the component
actually needs.

**Prefer framework routing.** A component that only reads route parameters and
builds links is asking for less than a router. `useRouteRef`,
`useRouteRefParams` and `useHref` from `@backstage/frontend-plugin-api` answer
from the framework and need no adapter on any page:

```tsx
import { useRouteRefParams } from '@backstage/frontend-plugin-api';
import { detailsRouteRef } from './routes';

const { name } = useRouteRefParams(detailsRouteRef);
```

**Mirror the page's adapter** when the content genuinely routes with its
library. Pass the same component the page renders in its `loader`, together
with the `mountPath` the page is registered at:

```tsx
import { renderInTestApp } from '@backstage/frontend-test-utils';
import { ReactRouterV6PageRouter } from '@backstage/plugin-app-react-router-v6';

await renderInTestApp(<EntityHeader />, {
  router: ReactRouterV6PageRouter,
  mountPath: '/catalog/:namespace/:kind/:name',
  initialRouteEntries: ['/catalog/default/component/my-entity'],
});
```

Without `mountPath` the element is treated as a page mounted at the app root.
With it, page-relative targets — a tab href, a `..` climb — resolve against the
pattern the way they would in a real app, and `useRouteRefParams` binds the
params the pattern names.

A component that wraps _itself_ in an adapter, which is what a plugin shipping
for both frontend systems does, needs no `router` option here. It also needs no
app around it in a plain `render()` test: an adapter with no page mount or no
app history renders its children untouched.

**Render app chrome as chrome.** A sidebar item, an error page, anything
attached to `app/root` is not a page: it renders above every page and inside
the app's own root React Router context, so it keeps one here too.

```tsx
await renderInTestApp(<MySidebarItem />, {
  renderAs: 'chrome',
  initialRouteEntries: ['/catalog/default/component/my-entity'],
});
```

`renderAs: 'chrome'` is a different question, not a milder `router`. Do not
reach for `router` to give chrome a context: that is a page adapter, and it
would hand chrome a page-scoped route context that no chrome has in a real app.
`mountPath` does not apply to chrome either, since chrome is not mounted at a
route.

### Verify the page's routing behavior

`renderTestApp` renders the real app wiring and the adapters declared by each
page. Test a plugin through its production exports at a route below the app
root. Assert the expected route parameters, relative link destinations and
content after navigation. These observations can detect a missing adapter;
a test that only asserts that the page rendered cannot establish that routing
works.

For isolated content tests, `renderInTestApp` can supply the adapter through
its `router` option. Keep at least one test of the production page declaration
when that declaration is responsible for installing the adapter.

Check shared dependencies as well as direct routing-library imports. A
provider may read location, and a shared link may use React Router's context.
The root v6 projection supports shared UI, but does not substitute for a
page's own match.

For guidance on navigation that crosses page or plugin boundaries, see
[Scoped plugin routing](../architecture/36-routes.md#scoped-plugin-routing), and
for the page side of the same decision see
[Choose a router for a page](./10-page-routers.md).

## Extension tree snapshots

For an isolated page and its attached sub-pages, pass
`createExtensionTester(page).add(subPage).reactElement()` to `renderInTestApp`.
The tester uses the same route matching as the app, retaining the extension
tree's node identities. The URL selects the active sub-page, and navigating to
the parent index redirects to the first sub-page while preserving the query
and fragment. Set `mountPath` to test a different mounting pattern; when it is
omitted, the subject is mounted at the app root. Use `renderTestApp` to test the
plugin's complete production route registration.

The `snapshot()` method on `ExtensionTester` returns a tree-shaped representation of the resolved extension hierarchy, which is convenient to use with Jest's `toMatchInlineSnapshot()` for verifying extension structure in tests.

## Missing something?

If there's anything else you think needs to be covered in the docs or that you think isn't covered by the test utilities, please create an issue in the Backstage repository. You are always welcome to contribute as well!
