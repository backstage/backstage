/*
 * Copyright 2026 The Backstage Authors
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

import type { ExtensionDefinition } from '@backstage/frontend-plugin-api';
import { CatalogColumnBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { CellText } from '@backstage/ui';

const nameColumn = CatalogColumnBlueprint.make({
  name: 'name',
  params: {
    id: 'name',
    label: 'Name',
    orderField: 'metadata.name',
    searchFields: ['metadata.name', 'metadata.title'],
    cell: entity => (
      <CellText title={entity.metadata.title ?? entity.metadata.name} />
    ),
  },
});

const ownerColumn = CatalogColumnBlueprint.make({
  name: 'owner',
  params: {
    id: 'owner',
    label: 'Owner',
    orderField: 'spec.owner',
    searchFields: ['spec.owner'],
    cell: entity => {
      const owner = (entity.spec as { owner?: unknown } | undefined)?.owner;
      return <CellText title={typeof owner === 'string' ? owner : ''} />;
    },
  },
});

const typeColumn = CatalogColumnBlueprint.make({
  name: 'type',
  params: {
    id: 'type',
    label: 'Type',
    orderField: 'spec.type',
    searchFields: ['spec.type'],
    cell: entity => {
      const type = (entity.spec as { type?: unknown } | undefined)?.type;
      return <CellText title={typeof type === 'string' ? type : ''} />;
    },
  },
});

const lifecycleColumn = CatalogColumnBlueprint.make({
  name: 'lifecycle',
  params: {
    id: 'lifecycle',
    label: 'Lifecycle',
    orderField: 'spec.lifecycle',
    searchFields: ['spec.lifecycle'],
    cell: entity => {
      const lifecycle = (entity.spec as { lifecycle?: unknown } | undefined)
        ?.lifecycle;
      return (
        <CellText title={typeof lifecycle === 'string' ? lifecycle : ''} />
      );
    },
  },
});

const descriptionColumn = CatalogColumnBlueprint.make({
  name: 'description',
  params: {
    id: 'description',
    label: 'Description',
    searchFields: ['metadata.description'],
    cell: entity => <CellText title={entity.metadata.description ?? ''} />,
  },
});

const tagsColumn = CatalogColumnBlueprint.make({
  name: 'tags',
  params: {
    id: 'tags',
    label: 'Tags',
    searchFields: ['metadata.tags'],
    cell: entity => (
      <CellText title={(entity.metadata.tags ?? []).join(', ')} />
    ),
  },
});

const columns: ExtensionDefinition[] = [
  nameColumn,
  ownerColumn,
  typeColumn,
  lifecycleColumn,
  descriptionColumn,
  tagsColumn,
];

export default columns;
