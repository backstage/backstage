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
import {
  analyticsApiRef,
  configApiRef,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
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
import { translationApiRef } from '@backstage/core-plugin-api/alpha';
import { catalogGraphApiRef, DefaultCatalogGraphApi } from '../../api';

const createEntity = (): Entity => ({
  apiVersion: 'a',
  kind: 'b',
  metadata: {
    name: 'c',
    namespace: 'd',
  },
});

const mountedRoutes = {
  '/entity/{kind}/{namespace}/{name}': entityRouteRef,
  '/catalog-graph': catalogGraphRouteRef,
};

describe('<CatalogGraphCard/>', () => {
  describe('frontend fetch mode', () => {
    let entity: Entity;
    let wrapper: JSX.Element;
    let apis: TestApiRegistry;
    const config = mockApis.config();
    const fetchApi: typeof fetchApiRef.T = {
      fetch: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
      entity = createEntity();
      apis = TestApiRegistry.from(
        [translationApiRef, mockApis.translation()],
        [configApiRef, config],
        [discoveryApiRef, mockApis.discovery()],
        [fetchApiRef, fetchApi],
        [
          catalogApiRef,
          catalogApiMock({ entities: [{ ...entity, relations: [] }] }),
        ],
        [
          catalogGraphApiRef,
          new DefaultCatalogGraphApi({
            config,
            discoveryApi: mockApis.discovery(),
            fetchApi,
          }),
        ],
      );

      wrapper = (
        <ApiProvider apis={apis}>
          <EntityProvider entity={entity}>
            <CatalogGraphCard />
          </EntityProvider>
        </ApiProvider>
      );
    });

    test('renders without exploding', async () => {
      await renderInTestApp(wrapper, { mountedRoutes });

      expect(await screen.findByText('b:d/c')).toBeInTheDocument();
      expect(await screen.findAllByTestId('node')).toHaveLength(1);
    });

    test('renders with custom title', async () => {
      await renderInTestApp(
        <ApiProvider apis={apis}>
          <EntityProvider entity={entity}>
            <CatalogGraphCard title="Custom Title" />
          </EntityProvider>
        </ApiProvider>,
        { mountedRoutes },
      );

      expect(await screen.findByText('Custom Title')).toBeInTheDocument();
    });

    test('renders with action attribute', async () => {
      await renderInTestApp(
        <ApiProvider apis={apis}>
          <EntityProvider entity={entity}>
            <CatalogGraphCard action={<Button title="Action Button" />} />
          </EntityProvider>
        </ApiProvider>,
        { mountedRoutes },
      );

      expect(await screen.findByTitle('Action Button')).toBeInTheDocument();
    });

    test('renders link to standalone viewer', async () => {
      await renderInTestApp(wrapper, { mountedRoutes });

      expect(await screen.findByText('b:d/c')).toBeInTheDocument();
      const button = screen.getByText('View graph');
      expect(button).toBeInTheDocument();
      expect(button.closest('a')).toHaveAttribute(
        'href',
        '/catalog-graph?rootEntityRefs%5B%5D=b%3Ad%2Fc&maxDepth=1&unidirectional=true&mergeRelations=true&direction=LR',
      );
    });

    test('renders link to standalone viewer with custom config', async () => {
      await renderInTestApp(
        <ApiProvider apis={apis}>
          <EntityProvider entity={entity}>
            <CatalogGraphCard maxDepth={2} mergeRelations={false} />
          </EntityProvider>
        </ApiProvider>,
        { mountedRoutes },
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
      const analyticsApi = mockApis.analytics();
      await renderInTestApp(
        <TestApiProvider
          apis={[
            [analyticsApiRef, analyticsApi],
            [translationApiRef, mockApis.translation()],
          ]}
        >
          {wrapper}
        </TestApiProvider>,
        { mountedRoutes },
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

  describe('backend fetch mode', () => {
    let entity: Entity;
    let wrapper: JSX.Element;
    let apis: TestApiRegistry;
    const config = mockApis.config({
      data: { catalogGraph: { fetchMode: 'backend' } },
    });
    const fetchApi: typeof fetchApiRef.T = {
      fetch: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
      entity = createEntity();
      fetchApi.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          entities: [{ ...entity, relations: [] }],
          cutoff: false,
        }),
      });
      apis = TestApiRegistry.from(
        [translationApiRef, mockApis.translation()],
        [configApiRef, config],
        [discoveryApiRef, mockApis.discovery()],
        [fetchApiRef, fetchApi],
        [catalogApiRef, catalogApiMock()],
        [
          catalogGraphApiRef,
          new DefaultCatalogGraphApi({
            config,
            discoveryApi: mockApis.discovery(),
            fetchApi,
          }),
        ],
      );

      wrapper = (
        <ApiProvider apis={apis}>
          <EntityProvider entity={entity}>
            <CatalogGraphCard />
          </EntityProvider>
        </ApiProvider>
      );
    });

    test('renders without exploding', async () => {
      await renderInTestApp(wrapper, { mountedRoutes });

      expect(await screen.findByText('b:d/c')).toBeInTheDocument();
      expect(await screen.findAllByTestId('node')).toHaveLength(1);
      expect(fetchApi.fetch).toHaveBeenCalled();
    });

    test('renders with custom title', async () => {
      await renderInTestApp(
        <ApiProvider apis={apis}>
          <EntityProvider entity={entity}>
            <CatalogGraphCard title="Custom Title" />
          </EntityProvider>
        </ApiProvider>,
        { mountedRoutes },
      );

      expect(await screen.findByText('Custom Title')).toBeInTheDocument();
    });

    test('renders with action attribute', async () => {
      await renderInTestApp(
        <ApiProvider apis={apis}>
          <EntityProvider entity={entity}>
            <CatalogGraphCard action={<Button title="Action Button" />} />
          </EntityProvider>
        </ApiProvider>,
        { mountedRoutes },
      );

      expect(await screen.findByTitle('Action Button')).toBeInTheDocument();
    });

    test('renders link to standalone viewer', async () => {
      await renderInTestApp(wrapper, { mountedRoutes });

      expect(await screen.findByText('b:d/c')).toBeInTheDocument();
      const button = screen.getByText('View graph');
      expect(button).toBeInTheDocument();
      expect(button.closest('a')).toHaveAttribute(
        'href',
        '/catalog-graph?rootEntityRefs%5B%5D=b%3Ad%2Fc&maxDepth=1&unidirectional=true&mergeRelations=true&direction=LR',
      );
    });

    test('renders link to standalone viewer with custom config', async () => {
      await renderInTestApp(
        <ApiProvider apis={apis}>
          <EntityProvider entity={entity}>
            <CatalogGraphCard maxDepth={2} mergeRelations={false} />
          </EntityProvider>
        </ApiProvider>,
        { mountedRoutes },
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
      const analyticsApi = mockApis.analytics();
      await renderInTestApp(
        <TestApiProvider
          apis={[
            [analyticsApiRef, analyticsApi],
            [translationApiRef, mockApis.translation()],
          ]}
        >
          {wrapper}
        </TestApiProvider>,
        { mountedRoutes },
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
});
