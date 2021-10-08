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
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import {
  CatalogApi,
  catalogApiRef,
  EntityProvider,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { catalogEntityRouteRef, catalogGraphRouteRef } from '../../routes';
import { CatalogGraphCard } from './CatalogGraphCard';

describe('<CatalogGraphCard/>', () => {
  let entity: Entity;
  let wrapper: JSX.Element;
  let catalog: jest.Mocked<CatalogApi>;
  let apis: ApiRegistry;

  beforeAll(() => {
    Object.defineProperty(window.SVGElement.prototype, 'getBBox', {
      value: () => ({ width: 100, height: 100 }),
      configurable: true,
    });
  });

  beforeEach(() => {
    entity = {
      apiVersion: 'a',
      kind: 'b',
      metadata: {
        name: 'c',
        namespace: 'd',
      },
    };
    catalog = {
      getEntities: jest.fn(),
      getEntityByName: jest.fn(async _ => ({ ...entity, relations: [] })),
      removeEntityByUid: jest.fn(),
      getLocationById: jest.fn(),
      getOriginLocationByEntity: jest.fn(),
      getLocationByEntity: jest.fn(),
      addLocation: jest.fn(),
      removeLocationById: jest.fn(),
      refreshEntity: jest.fn(),
      getEntityAncestors: jest.fn(),
    };
    apis = ApiRegistry.with(catalogApiRef, catalog);

    wrapper = (
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <CatalogGraphCard />
        </EntityProvider>
      </ApiProvider>
    );
  });

  test('renders without exploding', async () => {
    const { findByText, findAllByTestId } = await renderInTestApp(wrapper, {
      mountedRoutes: {
        '/entity/{kind}/{namespace}/{name}': catalogEntityRouteRef,
        '/catalog-graph': catalogGraphRouteRef,
      },
    });

    expect(await findByText('b:d/c')).toBeInTheDocument();
    expect(await findAllByTestId('node')).toHaveLength(1);
    expect(catalog.getEntityByName).toBeCalledTimes(1);
  });

  test('renders with custom title', async () => {
    const { findByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <CatalogGraphCard title="Custom Title" />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/entity/{kind}/{namespace}/{name}': catalogEntityRouteRef,
          '/catalog-graph': catalogGraphRouteRef,
        },
      },
    );

    expect(await findByText('Custom Title')).toBeInTheDocument();
  });

  test('renders link to standalone viewer', async () => {
    const { findByText, getByText } = await renderInTestApp(wrapper, {
      mountedRoutes: {
        '/entity/{kind}/{namespace}/{name}': catalogEntityRouteRef,
        '/catalog-graph': catalogGraphRouteRef,
      },
    });

    expect(await findByText('b:d/c')).toBeInTheDocument();
    const button = getByText('View graph');
    expect(button).toBeInTheDocument();
    expect(button.closest('a')).toHaveAttribute(
      'href',
      '/catalog-graph?rootEntityRefs%5B%5D=b%3Ad%2Fc',
    );
  });
});
