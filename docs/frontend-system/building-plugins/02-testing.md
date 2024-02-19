---
id: testing
title: Frontend System Testing Plugins
sidebar_label: Testing
# prettier-ignore
description: Testing plugins in the frontend system
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

# Testing Frontend Plugins

> NOTE: The new frontend system is in alpha, and some plugins do not yet fully implement it.

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

To mock [Utility APIs](../architecture/06-utility-apis.md) that are used by your component you can use the `TestApiProvider` to override individual API implementations. In the snippet below, we wrap the component within a `TestApiProvider` in order to mock the catalog client API:

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

## Testing extensions

To facilitate testing of frontend extensions, the `@backstage/frontend-test-utils` package provides a tester class which starts up an entire frontend harness, complete with a number of default features. You can then provide overrides for extensions whose behavior you need to adjust for the test run.

A number of features (frontend extensions and overrides) are also accepted by the tester. Here are some examples of how these facilities can be useful:

### Single extension

In order to test an extension in isolation, you simply need to pass it into the tester factory, then call the render method on the returned instance:

```tsx
import { screen } from '@testing-library/react';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import { indexPageExtension } from './plugin';

describe('Index page', () => {
  it('should render a the index page', () => {
    createExtensionTester(indexPageExtension).render();

    expect(screen.getByText('Index Page')).toBeInTheDocument();
  });
});
```

### Extension preset

There are some extensions that rely on other extensions existence, such as a page that links to another page. In that case, you can add more than one extension to the preset of features you want to render in the test, as shown below:

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import { indexPageExtension, detailsPageExtension } from './plugin';

describe('Index page', async () => {
  it('should link to the details page', () => {
    createExtensionTester(indexPageExtension)
      // Adding more extensions to the preset being tested
      .add(detailsPageExtension)
      .render();

    await expect(screen.findByText('Index Page')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('link', { name: 'See details' }));

    await expect(
      screen.findByText('Details Page'),
    ).resolves.toBeInTheDocument();
  });
});
```

### Mocking apis

If your extensions requires implementation of APIs that aren't wired up by default, you'll have to add overrides to the preset of features being tested:

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createApiFactory } from '@backestage/core-plugin-api';
import {
  createExtensionOverrides,
  configApiRef,
  analyticsApiRef,
} from '@backstage/frontend-plugin-api';
import {
  createExtensionTester,
  MockConfigApi,
  MockAnalyticsApi,
} from '@backstage/frontend-test-utils';
import { indexPageExtension } from './plugin';

describe('Index page', () => {
  it('should capture click events in analytics', async () => {
    // Mocking the analytics api implementation
    const analyticsApiMock = new MockAnalyticsApi();

    const analyticsApiOverride = createApiExtension({
      factory: createApiFactory({
        api: analyticsApiRef,
        factory: () => analyticsApiMock,
      }),
    });

    createExtensionTester(indexPageExtension)
      // Overriding the analytics api extension
      .add(analyticsApiOverride)
      .render();

    await userEvent.click(
      await screen.findByRole('link', { name: 'See details' }),
    );

    expect(analyticsApiMock.getEvents()[0]).toMatchObject({
      action: 'click',
      subject: 'See details',
    });
  });
});
```

### Setting configuration

In the case that your extension can be configured, you can test this capability by passing configuration values as follows:

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import { indexPageExtension, detailsPageExtension } from './plugin';

describe('Index page', () => {
  it('should accepts a custom title via config', async () => {
    createExtensionTester(indexPageExtension, {
      // Configuration specific of index page
      config: { title: 'Custom index' },
    })
      .add(detailsExtensionPage, {
        // Configuration specific of details page
        config: { title: 'Custom details' },
      })
      .render({
        // Configuration specific of the instance
        config: {
          app: {
            title: 'Custom app',
          },
        },
      });

    await expect(
      screen.findByRole('heading', { name: 'Custom app' }),
    ).resolves.toBeInTheDocument();

    await expect(
      screen.findByRole('heading', { name: 'Custom index' }),
    ).resolves.toBeInTheDocument();

    await userEvent.click(screen.getByRole('link', { name: 'See details' }));

    await expect(
      screen.findByText('Custom details'),
    ).resolves.toBeInTheDocument();
  });
});
```

That's all for testing features!

## Missing something?

If there's anything else you think needs to be covered in the docs or that you think isn't covered by the test utilities, please create an issue in the Backstage repository. You are always welcome to contribute as well!
