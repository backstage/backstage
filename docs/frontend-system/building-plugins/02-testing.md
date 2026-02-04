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

To mock [Utility APIs](../architecture/33-utility-apis.md) that are used by your component, pass API overrides to `renderInTestApp` using the `apis` option. Mock helpers are available from `@backstage/frontend-test-utils` and plugin-specific test utilities:

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

## Extension tree snapshots

The `snapshot()` method on `ExtensionTester` returns a tree-shaped representation of the resolved extension hierarchy, which is convenient to use with Jest's `toMatchInlineSnapshot()` for verifying extension structure in tests.

## Missing something?

If there's anything else you think needs to be covered in the docs or that you think isn't covered by the test utilities, please create an issue in the Backstage repository. You are always welcome to contribute as well!
