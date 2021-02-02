/*
 * Copyright 2020 Spotify AB
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

import {
  ComponentEntity,
  EntityName,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import { Table, TableColumn } from '@backstage/core';
import {
  EntityRefLink,
  EntityRefLinks,
  formatEntityRefTitle,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import React from 'react';

type EntityRow = {
  entity: ComponentEntity;
  resolved: {
    partOfSystemRelationTitle?: string;
    partOfSystemRelations: EntityName[];
    ownedByRelationsTitle?: string;
    ownedByRelations: EntityName[];
  };
};

const columns: TableColumn<EntityRow>[] = [
  {
    title: 'Name',
    field: 'entity.metadata.name',
    highlight: true,
    render: ({ entity }) => (
      <EntityRefLink entityRef={entity}>{entity.metadata.name}</EntityRefLink>
    ),
  },
  {
    title: 'System',
    field: 'resolved.partOfSystemRelationTitle',
    render: ({ resolved }) => (
      <EntityRefLinks
        entityRefs={resolved.partOfSystemRelations}
        defaultKind="system"
      />
    ),
  },
  {
    title: 'Owner',
    field: 'resolved.ownedByRelationsTitle',
    render: ({ resolved }) => (
      <EntityRefLinks
        entityRefs={resolved.ownedByRelations}
        defaultKind="group"
      />
    ),
  },
  {
    title: 'Lifecycle',
    field: 'entity.spec.lifecycle',
  },
  {
    title: 'Type',
    field: 'entity.spec.type',
  },
  {
    title: 'Description',
    field: 'entity.metadata.description',
    width: 'auto',
  },
];

type Props = {
  title: string;
  variant?: string;
  entities: (ComponentEntity | undefined)[];
};

// TODO: In theory this could also be systems!
export const ComponentsTable = ({
  entities,
  title,
  variant = 'gridItem',
}: Props) => {
  const tableStyle: React.CSSProperties = {
    minWidth: '0',
    width: '100%',
  };

  if (variant === 'gridItem') {
    tableStyle.height = 'calc(100% - 10px)';
  }

  const rows = entities
    // TODO: For now we skip all Components that we can't find without a warning!
    .filter(e => e !== undefined)
    .map(entity => {
      const partOfSystemRelations = getEntityRelations(
        entity,
        RELATION_PART_OF,
        {
          kind: 'system',
        },
      );
      const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);

      return {
        entity: entity as ComponentEntity,
        resolved: {
          ownedByRelationsTitle: ownedByRelations
            .map(r => formatEntityRefTitle(r, { defaultKind: 'group' }))
            .join(', '),
          ownedByRelations,
          partOfSystemRelationTitle: partOfSystemRelations
            .map(r =>
              formatEntityRefTitle(r, {
                defaultKind: 'system',
              }),
            )
            .join(', '),
          partOfSystemRelations,
        },
      };
    });

  return (
    <Table<EntityRow>
      columns={columns}
      title={title}
      style={tableStyle}
      options={{
        // TODO: Toolbar padding if off compared to other cards, should be: padding: 16px 24px;
        search: false,
        paging: false,
        actionsColumnIndex: -1,
        padding: 'dense',
      }}
      data={rows}
    />
  );
};
