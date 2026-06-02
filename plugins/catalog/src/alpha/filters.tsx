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

import { CatalogFilterBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { z } from 'zod/v4';

const catalogKindCatalogFilter = CatalogFilterBlueprint.makeWithOverrides({
  name: 'kind',
  configSchema: {
    initialFilter: z.string().default('component'),
  },
  factory(originalFactory, { config }) {
    return originalFactory({
      label: 'Kind',
      path: 'kind',
      mode: 'single',
      defaultValue: config.initialFilter,
    });
  },
});

const catalogTypeCatalogFilter = CatalogFilterBlueprint.make({
  name: 'type',
  params: {
    label: 'Type',
    path: 'spec.type',
    mode: 'single',
  },
});

const catalogTagCatalogFilter = CatalogFilterBlueprint.make({
  name: 'tag',
  params: {
    label: 'Tags',
    path: 'metadata.tags',
    mode: 'multi',
  },
});

const catalogLifecycleCatalogFilter = CatalogFilterBlueprint.make({
  name: 'lifecycle',
  params: {
    label: 'Lifecycle',
    path: 'spec.lifecycle',
    mode: 'multi',
  },
});

const catalogNamespaceCatalogFilter = CatalogFilterBlueprint.make({
  name: 'namespace',
  params: {
    label: 'Namespace',
    path: 'metadata.namespace',
    mode: 'multi',
  },
});

const catalogModeCatalogFilter = CatalogFilterBlueprint.makeWithOverrides({
  name: 'mode',
  configSchema: {
    mode: z.enum(['owners-only', 'all']).optional(),
  },
  factory(originalFactory, { config }) {
    return originalFactory({
      loader: async () => {
        const { EntityOwnerPicker } = await import(
          '@backstage/plugin-catalog-react'
        );
        return <EntityOwnerPicker mode={config.mode} />;
      },
    });
  },
});

const catalogProcessingStatusCatalogFilter = CatalogFilterBlueprint.make({
  name: 'processing-status',
  params: {
    label: 'Processing Status',
    mode: 'multi',
    options: [
      { label: 'Is Orphan', value: 'orphan' },
      { label: 'Has Error', value: 'error' },
    ],
    toFilter(selected) {
      if (!selected.length) return undefined;
      return {
        getCatalogFilters() {
          const filters: Record<string, string | string[]> = {};
          if (selected.includes('orphan')) {
            filters['metadata.annotations.backstage.io/orphan'] = 'true';
          }
          return filters;
        },
        filterEntity(entity) {
          if (selected.includes('orphan')) {
            const orphan = entity.metadata.annotations?.['backstage.io/orphan'];
            if (orphan !== 'true') return false;
          }
          if (selected.includes('error')) {
            const status = (entity as any)?.status?.items;
            if (!status || status.length === 0) return false;
          }
          return true;
        },
      };
    },
  },
});

const catalogListCatalogFilter = CatalogFilterBlueprint.makeWithOverrides({
  name: 'list',
  configSchema: {
    initialFilter: z.enum(['owned', 'starred', 'all']).default('owned'),
  },
  factory(originalFactory, { config }) {
    return originalFactory({
      loader: async () => {
        const { UserListPicker } = await import(
          '@backstage/plugin-catalog-react'
        );
        return <UserListPicker initialFilter={config.initialFilter} />;
      },
    });
  },
});

// the default order that the filters will be applied in
export default [
  catalogKindCatalogFilter,
  catalogTypeCatalogFilter,
  catalogListCatalogFilter,
  catalogModeCatalogFilter,
  catalogLifecycleCatalogFilter,
  catalogTagCatalogFilter,
  catalogProcessingStatusCatalogFilter,
  catalogNamespaceCatalogFilter,
];
