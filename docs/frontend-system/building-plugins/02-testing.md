---
id: testing
title: Frontend System Testing Plugins
sidebar_label: Testing
# prettier-ignore
description: Testing plugins in the frontend system
---

:::info
The new frontend system is in alpha and is only supported by a small number of plugins. If you want to use the new
plugin system, you must migrate your entire Backstage application or start a new application from scratch. We do not yet
recommend migrating any apps to the new system.
:::

# Testing Frontend Plugins

:::info
The new frontend system is in alpha and is only supported by a small number of plugins. If you want to use the new
plugin system, you must migrate your entire Backstage application or start a new application from scratch. We do not yet
recommend migrating any apps to the new system.
:::

Utilities for testing frontend features and components are available in `@backstage/frontend-test-utils`.

## Testing React components

A component can be used for more than one extension, and it should be tested independently of an extension environment.

Use the `renderInTestApp` helper to render a given component inside a Backstage test app:

```tsx
import React from 'react';
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

To mock [Utility APIs](../architecture/33-utility-apis.md) that are used by your component you can use the `TestApiProvider` to override individual API implementations. In the snippet below, we wrap the component within a `TestApiProvider` in order to mock the catalog client API:

```tsx
import React from 'react';
import { screen } from '@testing-library/react';
import {
  renderInTestApp,
  TestApiProvider,
} from '@backstage/frontend-test-utils';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog-react';
import { EntityDetails } from './plugin';

describe('Entity details component', () => {
  it('should render the entity name and owner', async () => {
    const catalogApiMock = {
      async getEntityFacets() {
        return {
          facets: {
            'relations.ownedBy': [{ count: 1, value: 'group:default/tools' }],
          },
        },
      }
    } satisfies Partial<typeof catalogApiRef.T>;

    const entityRef = stringifyEntityRef({
      kind: 'Component',
      namespace: 'default',
      name: 'test',
    });

    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApiMock]]}>
        <EntityDetails entityRef={entityRef} />
      </TestApiProvider>,
    );

    await expect(
      screen.findByText('The entity "test" is owned by "tools"'),
    ).resolves.toBeInTheDocument();
  });
});
```

This pattern also works for many other context providers. An important example is the `EntityProvider` from the `@backstage/plugin-catalog-react` package, which you can use to provide a mocked entity context to the component.

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
  it('should render a the index page', async () => {
    await renderInTestApp(
      createExtensionTester(indexPageExtension).reactElement(),
    );

    expect(screen.getByText('Index Page')).toBeInTheDocument();
  });
});
```

This pattern also allows you to wrap the extension with context providers, such as the `TestApiProvider` that was introduced [above](#testing-react-components).

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
  it('should accepts a custom title via config', async () => {
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

That's all for testing features!

## Missing something?

If there's anything else you think needs to be covered in the docs or that you think isn't covered by the test utilities, please create an issue in the Backstage repository. You are always welcome to contribute as well!
