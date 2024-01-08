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

const catalogTagCatalogFilter = createCatalogFilterExtension({
  name: 'tag',
  loader: async () => {
    const { EntityTagPicker } = await import('@backstage/plugin-catalog-react');
    return <EntityTagPicker />;
  },
});

const catalogKindCatalogFilter = createCatalogFilterExtension({
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

const catalogTypeCatalogFilter = createCatalogFilterExtension({
  name: 'type',
  loader: async () => {
    const { EntityTypePicker } = await import(
      '@backstage/plugin-catalog-react'
    );
    return <EntityTypePicker />;
  },
});

const catalogModeCatalogFilter = createCatalogFilterExtension({
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

const catalogNamespaceCatalogFilter = createCatalogFilterExtension({
  name: 'namespace',
  loader: async () => {
    const { EntityNamespacePicker } = await import(
      '@backstage/plugin-catalog-react'
    );
    return <EntityNamespacePicker />;
  },
});

const catalogLifecycleCatalogFilter = createCatalogFilterExtension({
  name: 'lifecycle',
  loader: async () => {
    const { EntityLifecyclePicker } = await import(
      '@backstage/plugin-catalog-react'
    );
    return <EntityLifecyclePicker />;
  },
});

const catalogProcessingStatusCatalogFilter = createCatalogFilterExtension({
  name: 'processing-status',
  loader: async () => {
    const { EntityProcessingStatusPicker } = await import(
      '@backstage/plugin-catalog-react'
    );
    return <EntityProcessingStatusPicker />;
  },
});

const catalogListCatalogFilter = createCatalogFilterExtension({
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
  catalogTagCatalogFilter,
  catalogKindCatalogFilter,
  catalogTypeCatalogFilter,
  catalogModeCatalogFilter,
  catalogNamespaceCatalogFilter,
  catalogLifecycleCatalogFilter,
  catalogProcessingStatusCatalogFilter,
  catalogListCatalogFilter,
];
