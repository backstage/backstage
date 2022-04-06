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
import { analyticsApiRef } from '@backstage/core-plugin-api';
import {
  CatalogApi,
  catalogApiRef,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import {
  MockAnalyticsApi,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { CatalogGraphPage } from './CatalogGraphPage';

const navigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => navigate,
}));

describe('<CatalogGraphPage/>', () => {
  let wrapper: JSX.Element;
  let catalog: jest.Mocked<CatalogApi>;

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
          targetRef: 'b:d/e',
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
          targetRef: 'b:d/c',
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
      getEntityByRef: jest.fn(async (n: any) =>
        n === 'b:d/e' ? entityE : entityC,
      ),
      removeEntityByUid: jest.fn(),
      getLocationById: jest.fn(),
      getLocationByRef: jest.fn(),
      addLocation: jest.fn(),
      removeLocationById: jest.fn(),
      refreshEntity: jest.fn(),
      getEntityAncestors: jest.fn(),
      getEntityFacets: jest.fn(),
    };

    wrapper = (
      <TestApiProvider apis={[[catalogApiRef, catalog]]}>
        <CatalogGraphPage
          initialState={{
            showFilters: false,
            rootEntityRefs: ['b:d/c'],
            selectedKinds: ['b'],
          }}
        />
      </TestApiProvider>
    );
  });

  afterEach(() => jest.resetAllMocks());

  test('should render without exploding', async () => {
    const { getByText, findByText, findAllByTestId } = await renderInTestApp(
      wrapper,
      {
        mountedRoutes: {
          '/entity/{kind}/{namespace}/{name}': entityRouteRef,
        },
      },
    );

    expect(getByText('Catalog Graph')).toBeInTheDocument();
    expect(await findByText('b:d/c')).toBeInTheDocument();
    expect(await findByText('b:d/e')).toBeInTheDocument();
    expect(await findAllByTestId('node')).toHaveLength(2);
    expect(catalog.getEntityByRef).toBeCalledTimes(2);
  });

  test('should toggle filters', async () => {
    const { getByText, queryByText } = await renderInTestApp(wrapper, {
      mountedRoutes: {
        '/entity/{kind}/{namespace}/{name}': entityRouteRef,
      },
    });

    expect(queryByText('Max Depth')).toBeNull();

    await userEvent.click(getByText('Filters'));

    expect(getByText('Max Depth')).toBeInTheDocument();
  });

  test('should select other entity', async () => {
    const { getByText, findByText, findAllByTestId } = await renderInTestApp(
      wrapper,
      {
        mountedRoutes: {
          '/entity/{kind}/{namespace}/{name}': entityRouteRef,
        },
      },
    );

    expect(await findAllByTestId('node')).toHaveLength(2);

    await userEvent.click(getByText('b:d/e'));

    expect(await findByText('hasPart')).toBeInTheDocument();
  });

  test('should navigate to entity', async () => {
    const { getByText, findAllByTestId } = await renderInTestApp(wrapper, {
      mountedRoutes: {
        '/entity/{kind}/{namespace}/{name}': entityRouteRef,
      },
    });

    expect(await findAllByTestId('node')).toHaveLength(2);

    const user = userEvent.setup();
    await user.keyboard('{Shift>}');
    await user.click(getByText('b:d/e'));
    expect(navigate).toBeCalledWith('/entity/{kind}/{namespace}/{name}');
  });

  test('should capture analytics event when selecting other entity', async () => {
    const analyticsSpy = new MockAnalyticsApi();
    const { getByText, findAllByTestId } = await renderInTestApp(
      <TestApiProvider apis={[[analyticsApiRef, analyticsSpy]]}>
        {wrapper}
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/entity/{kind}/{namespace}/{name}': entityRouteRef,
        },
      },
    );

    expect(await findAllByTestId('node')).toHaveLength(2);

    // We wait a bit here to reliably reproduce an issue where that requires the `baseVal` and `view` mocks
    await new Promise(r => setTimeout(r, 100));

    await userEvent.click(getByText('b:d/e'));

    expect(analyticsSpy.getEvents()[0]).toMatchObject({
      action: 'click',
      subject: 'b:d/e',
    });
  });

  test('should capture analytics event when navigating to entity', async () => {
    const analyticsSpy = new MockAnalyticsApi();
    const { getByText, findAllByTestId } = await renderInTestApp(
      <TestApiProvider apis={[[analyticsApiRef, analyticsSpy]]}>
        {wrapper}
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/entity/{kind}/{namespace}/{name}': entityRouteRef,
        },
      },
    );

    expect(await findAllByTestId('node')).toHaveLength(2);

    const user = userEvent.setup();
    await user.keyboard('{Shift>}');
    await user.click(getByText('b:d/e'));

    expect(analyticsSpy.getEvents()[0]).toMatchObject({
      action: 'click',
      subject: 'b:d/e',
      attributes: {
        to: '/entity/{kind}/{namespace}/{name}',
      },
    });
  });
});
