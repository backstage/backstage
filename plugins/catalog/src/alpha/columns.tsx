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
import {
  CatalogColumnBlueprint,
  EntityTableColumnTitle,
} from '@backstage/plugin-catalog-react/alpha';
import { CellText } from '@backstage/ui';

const nameColumn = CatalogColumnBlueprint.make({
  name: 'name',
  params: {
    id: 'name',
    label: 'Name',
    header: () => <EntityTableColumnTitle translationKey="name" />,
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
    header: () => <EntityTableColumnTitle translationKey="owner" />,
    orderField: 'spec.owner',
    searchFields: ['spec.owner'],
    filter: 'not:kind:group,location,user',
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
    header: () => <EntityTableColumnTitle translationKey="type" />,
    orderField: 'spec.type',
    searchFields: ['spec.type'],
    filter: 'not:kind:domain,user',
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
    header: () => <EntityTableColumnTitle translationKey="lifecycle" />,
    orderField: 'spec.lifecycle',
    searchFields: ['spec.lifecycle'],
    filter: 'not:kind:group,location,system,template,user',
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
    header: () => <EntityTableColumnTitle translationKey="description" />,
    searchFields: ['metadata.description'],
    filter: 'not:kind:location',
    cell: entity => <CellText title={entity.metadata.description ?? ''} />,
  },
});

const tagsColumn = CatalogColumnBlueprint.make({
  name: 'tags',
  params: {
    id: 'tags',
    label: 'Tags',
    header: () => <EntityTableColumnTitle translationKey="tags" />,
    searchFields: ['metadata.tags'],
    filter: entity => entity.kind !== 'Location',
    cell: entity => (
      <CellText title={(entity.metadata.tags ?? []).join(', ')} />
    ),
  },
});

const systemColumn = CatalogColumnBlueprint.make({
  name: 'system',
  params: {
    id: 'system',
    label: 'System',
    header: () => <EntityTableColumnTitle translationKey="system" />,
    orderField: 'relations.partOf',
    searchFields: ['relations.partOf'],
    filter: 'not:kind:domain,group,location,system,template,user',
    cell: entity => {
      const partOf = entity.relations?.filter(r => r.type === 'partOf') ?? [];
      const systems = partOf
        .map(r => r.targetRef.split('/').pop() ?? r.targetRef)
        .join(', ');
      return <CellText title={systems} />;
    },
  },
});

const targetsColumn = CatalogColumnBlueprint.make({
  name: 'targets',
  params: {
    id: 'targets',
    label: 'Targets',
    header: () => <EntityTableColumnTitle translationKey="targets" />,
    searchFields: ['spec.targets', 'spec.target'],
    filter: 'kind:location',
    width: '2fr',
    cell: entity => {
      const spec = entity.spec as
        | { targets?: string[]; target?: string }
        | undefined;
      const targets = spec?.targets ?? (spec?.target ? [spec.target] : []);
      return <CellText title={targets.join(', ')} />;
    },
  },
});

const columns: ExtensionDefinition[] = [
  nameColumn,
  systemColumn,
  ownerColumn,
  typeColumn,
  lifecycleColumn,
  targetsColumn,
  descriptionColumn,
  tagsColumn,
];

export default columns;
