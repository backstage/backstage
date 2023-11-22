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

import React from 'react';
import { createCatalogFilterExtension } from './createCatalogFilterExtension';
import { createSchemaFromZod } from '@backstage/frontend-plugin-api';

const CatalogEntityTagFilter = createCatalogFilterExtension({
  name: 'tag',
  loader: async () => {
    const { EntityTagPicker } = await import('@backstage/plugin-catalog-react');
    return <EntityTagPicker />;
  },
});

const CatalogEntityKindFilter = createCatalogFilterExtension({
  name: 'kind',
  configSchema: createSchemaFromZod(z =>
    z.object({
      initialFilter: z.string().default('component'),
    }),
  ),
  loader: async ({ config }) => {
    const { EntityKindPicker } = await import(
      '@backstage/plugin-catalog-react'
    );
    return <EntityKindPicker initialFilter={config.initialFilter} />;
  },
});

const CatalogEntityTypeFilter = createCatalogFilterExtension({
  name: 'type',
  loader: async () => {
    const { EntityTypePicker } = await import(
      '@backstage/plugin-catalog-react'
    );
    return <EntityTypePicker />;
  },
});

const CatalogEntityOwnerFilter = createCatalogFilterExtension({
  name: 'mode',
  configSchema: createSchemaFromZod(z =>
    z.object({
      mode: z.enum(['owners-only', 'all']).optional(),
    }),
  ),
  loader: async ({ config }) => {
    const { EntityOwnerPicker } = await import(
      '@backstage/plugin-catalog-react'
    );
    return <EntityOwnerPicker mode={config.mode} />;
  },
});

const CatalogEntityNamespaceFilter = createCatalogFilterExtension({
  name: 'namespace',
  loader: async () => {
    const { EntityNamespacePicker } = await import(
      '@backstage/plugin-catalog-react'
    );
    return <EntityNamespacePicker />;
  },
});

const CatalogEntityLifecycleFilter = createCatalogFilterExtension({
  name: 'lifecycle',
  loader: async () => {
    const { EntityLifecyclePicker } = await import(
      '@backstage/plugin-catalog-react'
    );
    return <EntityLifecyclePicker />;
  },
});

const CatalogEntityProcessingStatusFilter = createCatalogFilterExtension({
  name: 'processing.status',
  loader: async () => {
    const { EntityProcessingStatusPicker } = await import(
      '@backstage/plugin-catalog-react'
    );
    return <EntityProcessingStatusPicker />;
  },
});

const CatalogUserListFilter = createCatalogFilterExtension({
  name: 'list',
  configSchema: createSchemaFromZod(z =>
    z.object({
      initialFilter: z.enum(['owned', 'starred', 'all']).default('owned'),
    }),
  ),
  loader: async ({ config }) => {
    const { UserListPicker } = await import('@backstage/plugin-catalog-react');
    return <UserListPicker initialFilter={config.initialFilter} />;
  },
});

export default [
  CatalogEntityTagFilter,
  CatalogEntityKindFilter,
  CatalogEntityTypeFilter,
  CatalogEntityOwnerFilter,
  CatalogEntityNamespaceFilter,
  CatalogEntityLifecycleFilter,
  CatalogEntityProcessingStatusFilter,
  CatalogUserListFilter,
];
