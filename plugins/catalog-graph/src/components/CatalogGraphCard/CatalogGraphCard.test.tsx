/*
 * Copyright 2021 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { ApiProvider } from '@backstage/core-app-api';
import { analyticsApiRef } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  EntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
  TestApiRegistry,
} from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { catalogGraphRouteRef } from '../../routes';
import { CatalogGraphCard } from './CatalogGraphCard';
import Button from '@material-ui/core/Button';

describe('<CatalogGraphCard/>', () => {
  let entity: Entity;
  let wrapper: JSX.Element;
  const catalog = catalogApiMock.mock();
  let apis: TestApiRegistry;

  beforeEach(() => {
    jest.clearAllMocks();

    entity = {
      apiVersion: 'a',
      kind: 'b',
      metadata: {
        name: 'c',
        namespace: 'd',
      },
    };
    apis = TestApiRegistry.from([catalogApiRef, catalog]);

    wrapper = (
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <CatalogGraphCard />
        </EntityProvider>
      </ApiProvider>
    );
  });

  test('renders without exploding', async () => {
    catalog.getEntitiesByRefs.mockImplementation(async _ => ({
      items: [
        {
          ...entity,
          relations: [],
        },
      ],
    }));

    await renderInTestApp(wrapper, {
      mountedRoutes: {
        '/entity/{kind}/{namespace}/{name}': entityRouteRef,
        '/catalog-graph': catalogGraphRouteRef,
      },
    });

    expect(await screen.findByText('b:d/c')).toBeInTheDocument();
    expect(await screen.findAllByTestId('node')).toHaveLength(1);
    expect(catalog.getEntitiesByRefs).toHaveBeenCalledTimes(1);
    expect(catalog.getEntitiesByRefs).toHaveBeenCalledWith(
      expect.objectContaining({ entityRefs: ['b:d/c'] }),
    );
  });

  test('renders with custom title', async () => {
    catalog.getEntitiesByRefs.mockImplementation(async _ => ({
      items: [
        {
          ...entity,
          relations: [],
        },
      ],
    }));

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <CatalogGraphCard title="Custom Title" />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/entity/{kind}/{namespace}/{name}': entityRouteRef,
          '/catalog-graph': catalogGraphRouteRef,
        },
      },
    );

    expect(await screen.findByText('Custom Title')).toBeInTheDocument();
  });

  test('renders with action attribute', async () => {
    catalog.getEntitiesByRefs.mockImplementation(async _ => ({
      items: [
        {
          ...entity,
          relations: [],
        },
      ],
    }));

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <CatalogGraphCard action={<Button title="Action Button" />} />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/entity/{kind}/{namespace}/{name}': entityRouteRef,
          '/catalog-graph': catalogGraphRouteRef,
        },
      },
    );

    expect(await screen.findByTitle('Action Button')).toBeInTheDocument();
  });

  test('renders link to standalone viewer', async () => {
    catalog.getEntitiesByRefs.mockImplementation(async _ => ({
      items: [
        {
          ...entity,
          relations: [],
        },
      ],
    }));

    await renderInTestApp(wrapper, {
      mountedRoutes: {
        '/entity/{kind}/{namespace}/{name}': entityRouteRef,
        '/catalog-graph': catalogGraphRouteRef,
      },
    });

    expect(await screen.findByText('b:d/c')).toBeInTheDocument();
    const button = screen.getByText('View graph');
    expect(button).toBeInTheDocument();
    expect(button.closest('a')).toHaveAttribute(
      'href',
      '/catalog-graph?rootEntityRefs%5B%5D=b%3Ad%2Fc&maxDepth=1&unidirectional=true&mergeRelations=true&direction=LR',
    );
  });

  test('renders link to standalone viewer with custom config', async () => {
    catalog.getEntitiesByRefs.mockImplementation(async _ => ({
      items: [
        {
          ...entity,
          relations: [],
        },
      ],
    }));

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <CatalogGraphCard maxDepth={2} mergeRelations={false} />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/entity/{kind}/{namespace}/{name}': entityRouteRef,
          '/catalog-graph': catalogGraphRouteRef,
        },
      },
    );

    expect(await screen.findByText('b:d/c')).toBeInTheDocument();
    const button = screen.getByText('View graph');
    expect(button).toBeInTheDocument();
    expect(button.closest('a')).toHaveAttribute(
      'href',
      '/catalog-graph?rootEntityRefs%5B%5D=b%3Ad%2Fc&maxDepth=2&unidirectional=true&mergeRelations=false&direction=LR',
    );
  });

  test('captures analytics event on click', async () => {
    catalog.getEntitiesByRefs.mockImplementation(async _ => ({
      items: [
        {
          ...entity,
          relations: [],
        },
      ],
    }));

    const analyticsApi = mockApis.analytics();
    await renderInTestApp(
      <TestApiProvider apis={[[analyticsApiRef, analyticsApi]]}>
        {wrapper}
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/entity/{kind}/{namespace}/{name}': entityRouteRef,
          '/catalog-graph': catalogGraphRouteRef,
        },
      },
    );

    expect(await screen.findByText('b:d/c')).toBeInTheDocument();
    await userEvent.click(await screen.findByText('b:d/c'));

    expect(analyticsApi.captureEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'click',
        subject: 'b:d/c',
        attributes: {
          to: '/entity/{kind}/{namespace}/{name}',
        },
      }),
    );
  });
});
