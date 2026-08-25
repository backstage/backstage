/*
 * Copyright 2025 The Backstage Authors
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

import { screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import { ComponentEntity, Entity } from '@backstage/catalog-model';
import {
  createTestEntityPage,
  catalogApiMock,
} from '@backstage/plugin-catalog-react/testUtils';
import catalogGraphPlugin from './alpha';
import { catalogGraphRouteRef } from './routes';
import { catalogGraphApiRef, DefaultCatalogGraphApi } from './api';

jest.setTimeout(30_000);

jest.mock('./components/CatalogGraphPage', () => {
  const { useCatalogGraphPage } = jest.requireActual<
    typeof import('./components/CatalogGraphPage/useCatalogGraphPage')
  >('./components/CatalogGraphPage/useCatalogGraphPage');
  const { useLocation } =
    jest.requireActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    CatalogGraphPage: (
      props: Parameters<typeof useCatalogGraphPage>[0] &
        Record<string, unknown>,
    ) => {
      const state = useCatalogGraphPage(props);
      const location = useLocation();

      return (
        <output data-testid="catalog-graph-page-state">
          {JSON.stringify({ props, state, search: location.search })}
        </output>
      );
    },
  };
});

const CatalogGraphEntityCard = catalogGraphPlugin.getExtension(
  'entity-card:catalog-graph/relations',
);
const CatalogGraphApi = catalogGraphPlugin.getExtension('api:catalog-graph');
const CatalogGraphPage = catalogGraphPlugin.getExtension('page:catalog-graph');

describe('catalog-graph alpha plugin', () => {
  describe('CatalogGraphPage', () => {
    it('should apply page configuration to the initial state and URL', async () => {
      const config = {
        selectedKinds: ['Component'],
        selectedRelations: ['dependsOn'],
        rootEntityRefs: ['component:default/my-service'],
        maxDepth: 3,
        unidirectional: false,
        mergeRelations: false,
        showArrowHeads: true,
        direction: 'RL',
        showFilters: false,
        curve: 'curveStepBefore',
        kinds: ['component'],
        relations: ['dependsOn'],
        relationPairs: [['dependsOn', 'dependencyOf']],
        zoom: 'disabled',
      };

      renderTestApp({
        extensions: [CatalogGraphPage],
        initialRouteEntries: ['/catalog-graph'],
        config: {
          app: {
            baseUrl: 'http://localhost:3000',
            extensions: [{ 'page:catalog-graph': { config } }],
          },
          backend: { baseUrl: 'http://localhost:7007' },
        },
      });

      await waitFor(() => {
        const snapshot = JSON.parse(
          screen.getByTestId('catalog-graph-page-state').textContent!,
        );

        expect(snapshot.props).toMatchObject({
          ...config,
          initialState: config,
        });
        expect(snapshot.state).toMatchObject({
          rootEntityNames: [
            {
              kind: 'component',
              namespace: 'default',
              name: 'my-service',
            },
          ],
          maxDepth: 3,
          selectedKinds: ['component'],
          selectedRelations: ['dependsOn'],
          unidirectional: false,
          mergeRelations: false,
          direction: 'RL',
          showFilters: false,
          curve: 'curveStepBefore',
        });

        const search = new URLSearchParams(snapshot.search);
        expect(search.getAll('rootEntityRefs[]')).toEqual([
          'component:default/my-service',
        ]);
        expect(search.get('maxDepth')).toBe('3');
        expect(search.getAll('selectedKinds[]')).toEqual(['component']);
        expect(search.getAll('selectedRelations[]')).toEqual(['dependsOn']);
        expect(search.get('unidirectional')).toBe('false');
        expect(search.get('mergeRelations')).toBe('false');
        expect(search.get('direction')).toBe('RL');
        expect(search.get('showFilters')).toBe('false');
        expect(search.get('curve')).toBe('curveStepBefore');
      });
    });
  });

  describe('CatalogGraphEntityCard', () => {
    it('should render with Relations title', async () => {
      const entity: ComponentEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-service',
          namespace: 'default',
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          owner: 'team-a',
        },
      };

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity }),
          CatalogGraphApi,
          CatalogGraphEntityCard,
        ],
        mountedRoutes: {
          '/catalog-graph': catalogGraphRouteRef,
        },
        apis: [
          catalogApiMock({ entities: [entity] }),
          [catalogGraphApiRef, new DefaultCatalogGraphApi()],
        ],
      });

      expect(await screen.findByText('Relations')).toBeInTheDocument();
      expect(
        await screen.findByText(
          'component:default/my-service',
          {},
          { timeout: 5_000 },
        ),
      ).toBeInTheDocument();
    });

    it('should render entity node in the graph for any entity kind', async () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'API',
        metadata: {
          name: 'my-api',
          namespace: 'production',
        },
        spec: {
          type: 'openapi',
          lifecycle: 'production',
          owner: 'team-b',
          definition: '{}',
        },
      };

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity }),
          CatalogGraphApi,
          CatalogGraphEntityCard,
        ],
        mountedRoutes: {
          '/catalog-graph': catalogGraphRouteRef,
        },
        apis: [
          catalogApiMock({ entities: [entity] }),
          [catalogGraphApiRef, new DefaultCatalogGraphApi()],
        ],
      });

      expect(await screen.findByText('Relations')).toBeInTheDocument();
      expect(
        await screen.findByText(
          'api:production/my-api',
          {},
          { timeout: 5_000 },
        ),
      ).toBeInTheDocument();
    });

    it('should render the View graph link', async () => {
      const entity: ComponentEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'test-component',
          namespace: 'default',
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          owner: 'team-a',
        },
      };

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity }),
          CatalogGraphApi,
          CatalogGraphEntityCard,
        ],
        mountedRoutes: {
          '/catalog-graph': catalogGraphRouteRef,
        },
        apis: [
          catalogApiMock({ entities: [entity] }),
          [catalogGraphApiRef, new DefaultCatalogGraphApi()],
        ],
      });

      expect(await screen.findByText('View graph')).toBeInTheDocument();
    });
  });
});
