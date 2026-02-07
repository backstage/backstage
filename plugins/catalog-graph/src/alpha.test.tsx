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

import { screen } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import { ComponentEntity, Entity } from '@backstage/catalog-model';
import {
  createTestEntityPage,
  catalogApiMock,
} from '@backstage/plugin-catalog-react/testUtils';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import catalogGraphPlugin from './alpha';
import { catalogGraphRouteRef } from './routes';
import { catalogGraphApiRef, DefaultCatalogGraphApi } from './api';

const CatalogGraphEntityCard = catalogGraphPlugin.getExtension(
  'entity-card:catalog-graph/relations',
);
const CatalogGraphApi = catalogGraphPlugin.getExtension('api:catalog-graph');

describe('catalog-graph alpha plugin', () => {
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
          [catalogApiRef, catalogApiMock({ entities: [entity] })],
          [catalogGraphApiRef, new DefaultCatalogGraphApi()],
        ],
      });

      expect(await screen.findByText('Relations')).toBeInTheDocument();
      expect(
        await screen.findByText('component:default/my-service'),
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
          [catalogApiRef, catalogApiMock({ entities: [entity] })],
          [catalogGraphApiRef, new DefaultCatalogGraphApi()],
        ],
      });

      expect(await screen.findByText('Relations')).toBeInTheDocument();
      expect(
        await screen.findByText('api:production/my-api'),
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
          [catalogApiRef, catalogApiMock({ entities: [entity] })],
          [catalogGraphApiRef, new DefaultCatalogGraphApi()],
        ],
      });

      expect(await screen.findByText('View graph')).toBeInTheDocument();
    });
  });
});
