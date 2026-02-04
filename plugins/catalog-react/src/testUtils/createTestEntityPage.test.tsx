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
import { Entity } from '@backstage/catalog-model';
import { createTestEntityPage } from './createTestEntityPage';
import { catalogApiMock } from './catalogApiMock';
import {
  EntityCardBlueprint,
  EntityContentBlueprint,
} from '../alpha/blueprints';
import { catalogApiRef } from '../api';

const mockEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'test-component',
    namespace: 'default',
  },
  spec: {
    type: 'service',
    lifecycle: 'production',
  },
};

describe('createTestEntityPage', () => {
  describe('entity cards', () => {
    it('should render a card for a matching entity', async () => {
      const testCard = EntityCardBlueprint.make({
        name: 'test-card',
        params: {
          loader: async () => <div>Test Card Content</div>,
        },
      });

      renderTestApp({
        extensions: [createTestEntityPage({ entity: mockEntity }), testCard],
      });

      expect(await screen.findByText('Test Card Content')).toBeInTheDocument();
    });

    it('should filter cards based on entity predicate', async () => {
      const apiOnlyCard = EntityCardBlueprint.make({
        name: 'api-card',
        params: {
          loader: async () => <div>API Card</div>,
          filter: entity => entity.kind === 'API',
        },
      });

      const componentCard = EntityCardBlueprint.make({
        name: 'component-card',
        params: {
          loader: async () => <div>Component Card</div>,
          filter: entity => entity.kind === 'Component',
        },
      });

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity: mockEntity }),
          apiOnlyCard,
          componentCard,
        ],
      });

      expect(await screen.findByText('Component Card')).toBeInTheDocument();
      expect(screen.queryByText('API Card')).not.toBeInTheDocument();
    });

    it('should filter cards based on predicate config', async () => {
      const kindCard = EntityCardBlueprint.make({
        name: 'kind-card',
        params: {
          loader: async () => <div>Kind Card</div>,
          filter: { kind: 'API' },
        },
      });

      const sentinelCard = EntityCardBlueprint.make({
        name: 'sentinel-card',
        params: {
          loader: async () => <div>Sentinel</div>,
        },
      });

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity: mockEntity }),
          kindCard,
          sentinelCard,
        ],
      });

      // Wait for rendering to complete via sentinel
      await screen.findByText('Sentinel');
      expect(screen.queryByText('Kind Card')).not.toBeInTheDocument();
    });

    it('should render multiple cards', async () => {
      const card1 = EntityCardBlueprint.make({
        name: 'card-1',
        params: {
          loader: async () => <div>Card 1</div>,
        },
      });

      const card2 = EntityCardBlueprint.make({
        name: 'card-2',
        params: {
          loader: async () => <div>Card 2</div>,
        },
      });

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity: mockEntity }),
          card1,
          card2,
        ],
      });

      expect(await screen.findByText('Card 1')).toBeInTheDocument();
      expect(await screen.findByText('Card 2')).toBeInTheDocument();
    });
  });

  describe('entity content', () => {
    it('should render a single content extension at root path', async () => {
      const testContent = EntityContentBlueprint.make({
        name: 'test-content',
        params: {
          path: '/details',
          title: 'Details',
          loader: async () => <div>Test Content</div>,
        },
      });

      renderTestApp({
        extensions: [createTestEntityPage({ entity: mockEntity }), testContent],
      });

      expect(await screen.findByText('Test Content')).toBeInTheDocument();
    });

    it('should filter content based on entity predicate', async () => {
      const apiContent = EntityContentBlueprint.make({
        name: 'api-content',
        params: {
          path: '/api-details',
          title: 'API Details',
          loader: async () => <div>API Content</div>,
          filter: entity => entity.kind === 'API',
        },
      });

      const sentinelCard = EntityCardBlueprint.make({
        name: 'sentinel-card',
        params: {
          loader: async () => <div>Sentinel</div>,
        },
      });

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity: mockEntity }),
          apiContent,
          sentinelCard,
        ],
      });

      // Wait for rendering to complete via sentinel
      await screen.findByText('Sentinel');
      expect(screen.queryByText('API Content')).not.toBeInTheDocument();
    });

    it('should render multiple content extensions with routing', async () => {
      const contentA = EntityContentBlueprint.make({
        name: 'content-a',
        params: {
          path: '/a',
          title: 'Content A',
          loader: async () => <div>Content A</div>,
        },
      });

      const contentB = EntityContentBlueprint.make({
        name: 'content-b',
        params: {
          path: '/b',
          title: 'Content B',
          loader: async () => <div>Content B</div>,
        },
      });

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity: mockEntity }),
          contentA,
          contentB,
        ],
      });

      // First content should be rendered at root by default
      expect(await screen.findByText('Content A')).toBeInTheDocument();
    });
  });

  describe('combined usage', () => {
    it('should render cards and content together', async () => {
      const testCard = EntityCardBlueprint.make({
        name: 'combined-card',
        params: {
          loader: async () => <div>Combined Card</div>,
        },
      });

      const testContent = EntityContentBlueprint.make({
        name: 'combined-content',
        params: {
          path: '/combined',
          title: 'Combined',
          loader: async () => <div>Combined Content</div>,
        },
      });

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity: mockEntity }),
          testCard,
          testContent,
        ],
      });

      expect(await screen.findByText('Combined Card')).toBeInTheDocument();
      expect(await screen.findByText('Combined Content')).toBeInTheDocument();
    });

    it('should work with different entity kinds', async () => {
      const apiEntity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'API',
        metadata: { name: 'test-api' },
        spec: { type: 'openapi' },
      };

      const apiCard = EntityCardBlueprint.make({
        name: 'api-specific-card',
        params: {
          loader: async () => <div>API Card</div>,
          filter: entity => entity.kind === 'API',
        },
      });

      renderTestApp({
        extensions: [createTestEntityPage({ entity: apiEntity }), apiCard],
      });

      expect(await screen.findByText('API Card')).toBeInTheDocument();
    });

    it('should provide entity context to cards', async () => {
      const entityNameCard = EntityCardBlueprint.make({
        name: 'entity-name-card',
        params: {
          loader: async () => {
            const { useEntity } = await import('../hooks/useEntity');
            const EntityNameDisplay = () => {
              const { entity } = useEntity();
              return <div>Entity: {entity.metadata.name}</div>;
            };
            return <EntityNameDisplay />;
          },
        },
      });

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity: mockEntity }),
          entityNameCard,
        ],
      });

      expect(
        await screen.findByText('Entity: test-component'),
      ).toBeInTheDocument();
    });
  });

  describe('catalog API', () => {
    it('should provide a mock catalog API with the entity', async () => {
      const catalogApiCard = EntityCardBlueprint.make({
        name: 'catalog-api-card',
        params: {
          loader: async () => {
            const { useApi } = await import('@backstage/core-plugin-api');
            const { catalogApiRef: ref } = await import('../api');
            const React = await import('react');
            const CatalogApiDisplay = () => {
              const catalogApi = useApi(ref);
              const [entities, setEntities] = React.useState<string[]>([]);
              React.useEffect(() => {
                catalogApi
                  .getEntities()
                  .then(response =>
                    setEntities(response.items.map(e => e.metadata.name)),
                  );
              }, [catalogApi]);
              return <div>Entities: {entities.join(', ') || 'loading'}</div>;
            };
            return <CatalogApiDisplay />;
          },
        },
      });

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity: mockEntity }),
          catalogApiCard,
        ],
      });

      expect(
        await screen.findByText('Entities: test-component'),
      ).toBeInTheDocument();
    });

    it('should allow user-provided catalog API to take precedence', async () => {
      const customEntities: Entity[] = [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { name: 'custom-a', namespace: 'default' },
          spec: { type: 'service' },
        },
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { name: 'custom-b', namespace: 'default' },
          spec: { type: 'service' },
        },
      ];

      const catalogApiCard = EntityCardBlueprint.make({
        name: 'catalog-api-card',
        params: {
          loader: async () => {
            const { useApi } = await import('@backstage/core-plugin-api');
            const { catalogApiRef: ref } = await import('../api');
            const React = await import('react');
            const CatalogApiDisplay = () => {
              const catalogApi = useApi(ref);
              const [entities, setEntities] = React.useState<string[]>([]);
              React.useEffect(() => {
                catalogApi
                  .getEntities()
                  .then(response =>
                    setEntities(response.items.map(e => e.metadata.name)),
                  );
              }, [catalogApi]);
              return <div>Entities: {entities.join(', ') || 'loading'}</div>;
            };
            return <CatalogApiDisplay />;
          },
        },
      });

      renderTestApp({
        extensions: [
          createTestEntityPage({ entity: mockEntity }),
          catalogApiCard,
        ],
        apis: [[catalogApiRef, catalogApiMock({ entities: customEntities })]],
      });

      // Should use the user-provided catalog API with custom entities, not mockEntity
      expect(
        await screen.findByText('Entities: custom-a, custom-b'),
      ).toBeInTheDocument();
    });
  });
});
