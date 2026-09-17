/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ComponentType } from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderInTestApp } from '@backstage/frontend-test-utils';
import { Entity } from '@backstage/catalog-model';
import {
  AsyncEntityProvider,
  entityRouteRef,
  MockStarredEntitiesApi,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import {
  defaultEntityContentGroupDefinitions,
  type EntityHeaderLayoutProps,
} from '@backstage/plugin-catalog-react/alpha';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { EntityLayoutBui } from './EntityLayoutBui';

const componentEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    namespace: 'default',
    name: 'artist-lookup',
    title: 'Artist Lookup',
    description: 'Catalog description',
  },
  spec: { type: 'service', lifecycle: 'experimental' },
};

async function renderLayout(options: {
  entity?: Entity;
  loading?: boolean;
  error?: Error;
  path?: string;
  NotFoundComponent?: React.ReactNode;
  HeaderComponent?: ComponentType<EntityHeaderLayoutProps>;
}) {
  return renderInTestApp(
    <AsyncEntityProvider
      entity={options.entity}
      loading={options.loading ?? false}
      error={options.error}
    >
      <EntityLayoutBui
        routes={[
          {
            path: '/overview',
            title: 'Overview',
            children: <div>Overview content</div>,
          },
          {
            path: '/hidden',
            title: 'Hidden',
            children: <div>Hidden content</div>,
            if: () => false,
          },
        ]}
        groupDefinitions={defaultEntityContentGroupDefinitions}
        defaultContentOrder="title"
        contextMenuItems={[]}
        NotFoundComponent={options.NotFoundComponent}
        HeaderComponent={options.HeaderComponent}
      />
    </AsyncEntityProvider>,
    {
      apis: [
        catalogApiMock({ entities: options.entity ? [options.entity] : [] }),
        [starredEntitiesApiRef, new MockStarredEntitiesApi()],
      ],
      config: {
        app: { title: 'Custom app' },
        backend: { baseUrl: 'http://localhost:7000' },
      },
      mountPath: '/catalog/:namespace/:kind/:name/*',
      initialRouteEntries: [
        `/catalog/default/component/artist-lookup${options.path ?? ''}`,
      ],
      mountedRoutes: {
        '/catalog/:namespace/:kind/:name/*': entityRouteRef,
      },
    },
  );
}

describe('EntityLayoutBui', () => {
  it('renders loading below the default fallback header', async () => {
    await renderLayout({ loading: true });
    expect(
      screen.getByRole('heading', { name: 'artist-lookup' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('renders selected content in a BUI container and composes the document title', async () => {
    await renderLayout({ entity: componentEntity, path: '/overview' });
    expect(await screen.findByText('Overview content')).toBeInTheDocument();
    await waitFor(() =>
      expect(document.title).toBe('Artist Lookup | Overview | Custom app'),
    );
  });

  it('renders unmatched entity content through the not-found page', async () => {
    await renderLayout({ entity: componentEntity, path: '/missing' });
    expect(await screen.findByTestId('error')).toBeInTheDocument();
  });

  it('renders errors and missing entities as BUI alerts', async () => {
    await renderLayout({ error: new Error('catalog failed') });
    expect(screen.getByText('Error: catalog failed')).toBeInTheDocument();
    expect(
      screen.getByText('Error: catalog failed').closest('[data-status]'),
    ).toHaveAttribute('data-status', 'danger');
  });

  it('renders the default and custom missing-entity states', async () => {
    const first = await renderLayout({});
    expect(screen.getByText('Entity not found')).toBeInTheDocument();
    first.unmount();

    await renderLayout({ NotFoundComponent: <div>Custom missing</div> });
    expect(screen.getByText('Custom missing')).toBeInTheDocument();
  });

  it('passes composed tabs and the active tab ID to a successor header', async () => {
    const HeaderComponent = jest.fn((props: EntityHeaderLayoutProps) => (
      <header>
        {props.tabs.map(tab => tab.label).join(',')}:{props.activeTabId}
      </header>
    ));
    await renderLayout({
      entity: componentEntity,
      path: '/overview',
      HeaderComponent,
    });
    expect(await screen.findByText('Overview:/overview')).toBeInTheDocument();
  });

  it('hosts the URL-driven Inspect dialog independently of the default header', async () => {
    await renderLayout({
      entity: componentEntity,
      path: '/overview?inspect=json',
      HeaderComponent: () => <header>Successor header</header>,
    });
    expect(await screen.findByText('Entity Inspector')).toBeInTheDocument();
  });
});
