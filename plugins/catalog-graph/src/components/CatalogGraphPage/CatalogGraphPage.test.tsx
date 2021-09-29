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
import { RELATION_HAS_PART, RELATION_PART_OF } from '@backstage/catalog-model';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { catalogEntityRouteRef } from '../../routes';
import { CatalogGraphPage } from './CatalogGraphPage';

const navigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => navigate,
}));

describe('<CatalogGraphPage/>', () => {
  let wrapper: JSX.Element;
  let catalog: jest.Mocked<CatalogApi>;

  beforeAll(() => {
    Object.defineProperty(window.SVGElement.prototype, 'getBBox', {
      value: () => ({ width: 100, height: 100 }),
      configurable: true,
    });
  });

  beforeEach(() => {
    const entityC = {
      apiVersion: 'a',
      kind: 'b',
      metadata: {
        name: 'c',
        namespace: 'd',
      },
      relations: [
        {
          type: RELATION_PART_OF,
          target: {
            kind: 'b',
            namespace: 'd',
            name: 'e',
          },
        },
      ],
    };
    const entityE = {
      apiVersion: 'a',
      kind: 'b',
      metadata: {
        name: 'e',
        namespace: 'd',
      },
      relations: [
        {
          type: RELATION_HAS_PART,
          target: {
            kind: 'b',
            namespace: 'd',
            name: 'c',
          },
        },
      ],
    };
    catalog = {
      getEntities: jest.fn(),
      getEntityByName: jest.fn(async n => (n.name === 'e' ? entityE : entityC)),
      removeEntityByUid: jest.fn(),
      getLocationById: jest.fn(),
      getOriginLocationByEntity: jest.fn(),
      getLocationByEntity: jest.fn(),
      addLocation: jest.fn(),
      removeLocationById: jest.fn(),
      refreshEntity: jest.fn(),
    };
    const apis = ApiRegistry.with(catalogApiRef, catalog);

    wrapper = (
      <ApiProvider apis={apis}>
        <CatalogGraphPage
          initialState={{
            showFilters: false,
            rootEntityRefs: ['b:d/c'],
            selectedKinds: ['b'],
          }}
        />
      </ApiProvider>
    );
  });

  afterEach(() => jest.resetAllMocks());

  test('should render without exploding', async () => {
    const { getByText, findByText, findAllByTestId } = await renderInTestApp(
      wrapper,
      {
        mountedRoutes: {
          '/entity/{kind}/{namespace}/{name}': catalogEntityRouteRef,
        },
      },
    );

    expect(getByText('Catalog Graph')).toBeInTheDocument();
    expect(await findByText('b:d/c')).toBeInTheDocument();
    expect(await findByText('b:d/e')).toBeInTheDocument();
    expect(await findAllByTestId('node')).toHaveLength(2);
    expect(catalog.getEntityByName).toBeCalledTimes(2);
  });

  test('should toggle filters', async () => {
    const { getByText, queryByText } = await renderInTestApp(wrapper, {
      mountedRoutes: {
        '/entity/{kind}/{namespace}/{name}': catalogEntityRouteRef,
      },
    });

    expect(queryByText('Max Depth')).toBeNull();

    userEvent.click(getByText('Filters'));

    expect(getByText('Max Depth')).toBeInTheDocument();
  });

  test('should select other entity', async () => {
    const { getByText, findByText, findAllByTestId } = await renderInTestApp(
      wrapper,
      {
        mountedRoutes: {
          '/entity/{kind}/{namespace}/{name}': catalogEntityRouteRef,
        },
      },
    );

    expect(await findAllByTestId('node')).toHaveLength(2);

    userEvent.click(getByText('b:d/e'));

    expect(await findByText('hasPart')).toBeInTheDocument();
  });

  test('should navigate to entity', async () => {
    const { getByText, findAllByTestId } = await renderInTestApp(wrapper, {
      mountedRoutes: {
        '/entity/{kind}/{namespace}/{name}': catalogEntityRouteRef,
      },
    });

    expect(await findAllByTestId('node')).toHaveLength(2);

    userEvent.click(getByText('b:d/e'), { shiftKey: true });

    expect(navigate).toBeCalledWith('/entity/{kind}/{namespace}/{name}');
  });
});
