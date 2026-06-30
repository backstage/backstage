/*
 * Copyright 2023 The Backstage Authors
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
import { createDevApp } from '@backstage/dev-utils';
import { catalogPlugin } from '@backstage/plugin-catalog';
import { orgPlugin } from '@backstage/plugin-org';
import {
  catalogUnprocessedEntitiesPlugin,
  CatalogUnprocessedEntitiesPage,
} from '../src/plugin';
import { catalogUnprocessedEntitiesApiRef } from '../src/api';
import {
  CatalogUnprocessedEntitiesApi,
  UnprocessedEntity,
} from '@backstage/plugin-catalog-unprocessed-entities-common';
import { createApiFactory } from '@backstage/core-plugin-api';

const failedEntities: UnprocessedEntity[] = [
  {
    entity_id: 'id-001',
    entity_ref: 'component:default/payment-service',
    location_key:
      'url:https://github.com/acme/payment-service/blob/main/catalog-info.yaml',
    unprocessed_entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'payment-service', tags: ['pci', 'critical'] },
      spec: {
        owner: 'team-payments',
        type: 'service',
        lifecycle: 'production',
      },
    },
    next_update_at: '2026-06-05T10:00:00.000Z',
    last_discovery_at: '2026-06-05T09:45:00.000Z',
    errors: [
      {
        name: 'ValidationError',
        message:
          'tags. must match the pattern ^[a-z0-9:+#]+(\\.[a-z0-9:+#]+)*$',
        cause: {
          name: 'InputError',
          message:
            'tags. must match the pattern ^[a-z0-9:+#]+(\\.[a-z0-9:+#]+)*$',
          stack:
            'InputError: tags. must match the pattern\n    at validate (catalog-model/src/validation.ts:42:11)',
        },
      },
    ],
  },
  {
    entity_id: 'id-002',
    entity_ref: 'component:default/inventory-api',
    location_key:
      'url:https://github.com/acme/inventory/blob/main/catalog-info.yaml',
    unprocessed_entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'INVALID NAME' },
      spec: {
        owner: 'team-logistics',
        type: 'service',
        lifecycle: 'experimental',
      },
    },
    next_update_at: '2026-06-05T10:05:00.000Z',
    last_discovery_at: '2026-06-05T09:40:00.000Z',
    errors: [
      {
        name: 'ValidationError',
        message:
          'metadata.name must match the pattern ^[a-z0-9A-Z]([-_a-z0-9A-Z]*[a-z0-9A-Z])?$',
        cause: {
          name: 'InputError',
          message: 'metadata.name must match the pattern',
          stack:
            'InputError: metadata.name must match the pattern\n    at validate (catalog-model/src/validation.ts:42:11)',
        },
      },
    ],
  },
  {
    entity_id: 'id-003',
    entity_ref: 'api:default/shipping-grpc',
    location_key:
      'url:https://github.com/acme/shipping/blob/main/catalog-info.yaml',
    unprocessed_entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: { name: 'shipping-grpc' },
      spec: { type: 'grpc', lifecycle: 'production' },
    },
    next_update_at: '2026-06-05T11:00:00.000Z',
    last_discovery_at: '2026-06-05T08:00:00.000Z',
    errors: [
      {
        name: 'ProcessingError',
        message:
          'Could not resolve owner group:default/team-shipping — the entity does not exist in the catalog',
        cause: {
          name: 'NotFoundError',
          message: 'group:default/team-shipping not found',
          stack:
            'NotFoundError: group:default/team-shipping not found\n    at resolveRelations (backend/src/catalog/processor.ts:120:13)',
        },
      },
    ],
  },
  {
    entity_id: 'id-004',
    entity_ref: 'component:default/legacy-monolith',
    location_key: undefined,
    unprocessed_entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'legacy-monolith' },
      spec: {},
    },
    next_update_at: '2026-06-05T10:30:00.000Z',
    last_discovery_at: '2026-06-04T22:00:00.000Z',
    errors: [
      {
        name: 'ValidationError',
        message: 'spec.type is required for kind Component',
        cause: {
          name: 'InputError',
          message: 'spec.type is required',
          stack:
            'InputError: spec.type is required\n    at validate (catalog-model/src/validation.ts:87:9)',
        },
      },
      {
        name: 'ValidationError',
        message: 'spec.lifecycle is required for kind Component',
        cause: {
          name: 'InputError',
          message: 'spec.lifecycle is required',
          stack:
            'InputError: spec.lifecycle is required\n    at validate (catalog-model/src/validation.ts:91:9)',
        },
      },
    ],
  },
];

const pendingEntities: UnprocessedEntity[] = [
  {
    entity_id: 'id-p01',
    entity_ref: 'component:default/data-pipeline',
    unprocessed_entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'data-pipeline' },
      spec: { owner: 'team-data', type: 'service', lifecycle: 'experimental' },
    },
    next_update_at: '2026-06-05T10:10:00.000Z',
    last_discovery_at: '2026-06-05T09:55:00.000Z',
  },
  {
    entity_id: 'id-p02',
    entity_ref: 'group:default/team-platform',
    unprocessed_entity: {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: { name: 'team-platform' },
      spec: { type: 'team', children: [] },
    },
    next_update_at: '2026-06-05T10:20:00.000Z',
    last_discovery_at: '2026-06-05T09:50:00.000Z',
  },
];

const mockApi: CatalogUnprocessedEntitiesApi = {
  failed: async () => ({ entities: failedEntities }),
  pending: async () => ({ entities: pendingEntities }),
  delete: async (_entityId: string) => {},
};

createDevApp()
  .registerPlugin(catalogPlugin)
  .registerPlugin(orgPlugin)
  .registerPlugin(catalogUnprocessedEntitiesPlugin)
  .registerApi(createApiFactory(catalogUnprocessedEntitiesApiRef, mockApi))
  .addPage({
    element: <CatalogUnprocessedEntitiesPage />,
    title: 'Root Page',
    path: '/catalog-unprocessed-entities',
  })
  .render();
