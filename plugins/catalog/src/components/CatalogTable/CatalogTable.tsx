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
  Entity,
  EntityName,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import {
  CodeSnippet,
  OverflowTooltip,
  Table,
  TableColumn,
  TableProps,
  WarningPanel,
} from '@backstage/core';
import {
  EntityRefLink,
  EntityRefLinks,
  formatEntityRefTitle,
  getEntityRelations,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import { Chip } from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import OpenInNew from '@material-ui/icons/OpenInNew';
import React from 'react';
import {
  getEntityMetadataEditUrl,
  getEntityMetadataViewUrl,
} from '../../utils';
import {
  favouriteEntityIcon,
  favouriteEntityTooltip,
} from '../FavouriteEntity/FavouriteEntity';

type EntityRow = {
  entity: Entity;
  resolved: {
    name: string;
    partOfSystemRelationTitle?: string;
    partOfSystemRelations: EntityName[];
    ownedByRelationsTitle?: string;
    ownedByRelations: EntityName[];
  };
};

const columns: TableColumn<EntityRow>[] = [
  {
    title: 'Name',
    field: 'resolved.name',
    highlight: true,
    render: ({ entity }) => (
      <EntityRefLink entityRef={entity} defaultKind="Component" />
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
    title: 'Type',
    field: 'entity.spec.type',
    hidden: true,
  },
  {
    title: 'Lifecycle',
    field: 'entity.spec.lifecycle',
  },
  {
    title: 'Description',
    field: 'entity.metadata.description',
    render: ({ entity }) => (
      <OverflowTooltip
        text={entity.metadata.description}
        placement="bottom-start"
      />
    ),
    width: 'auto',
  },
  {
    title: 'Tags',
    field: 'entity.metadata.tags',
    cellStyle: {
      padding: '0px 16px 0px 20px',
    },
    render: ({ entity }) => (
      <>
        {entity.metadata.tags &&
          entity.metadata.tags.map(t => (
            <Chip
              key={t}
              label={t}
              size="small"
              variant="outlined"
              style={{ marginBottom: '0px' }}
            />
          ))}
      </>
    ),
  },
];

type CatalogTableProps = {
  entities: Entity[];
  titlePreamble: string;
  loading: boolean;
  error?: any;
  view?: string;
};

export const CatalogTable = ({
  entities,
  loading,
  error,
  titlePreamble,
  view,
}: CatalogTableProps) => {
  const { isStarredEntity, toggleStarredEntity } = useStarredEntities();

  if (error) {
    return (
      <div>
        <WarningPanel
          severity="error"
          title="Could not fetch catalog entities."
        >
          <CodeSnippet language="text" text={error.toString()} />
        </WarningPanel>
      </div>
    );
  }

  const actions: TableProps<EntityRow>['actions'] = [
    ({ entity }) => {
      const url = getEntityMetadataViewUrl(entity);
      return {
        icon: () => <OpenInNew fontSize="small" />,
        tooltip: 'View',
        disabled: !url,
        onClick: () => {
          if (!url) return;
          window.open(url, '_blank');
        },
      };
    },
    ({ entity }) => {
      const url = getEntityMetadataEditUrl(entity);
      return {
        icon: () => <Edit fontSize="small" />,
        tooltip: 'Edit',
        disabled: !url,
        onClick: () => {
          if (!url) return;
          window.open(url, '_blank');
        },
      };
    },
    ({ entity }) => {
      const isStarred = isStarredEntity(entity);
      return {
        cellStyle: { paddingLeft: '1em' },
        icon: () => favouriteEntityIcon(isStarred),
        tooltip: favouriteEntityTooltip(isStarred),
        onClick: () => toggleStarredEntity(entity),
      };
    },
  ];

  const rows = entities.map(entity => {
    const partOfSystemRelations = getEntityRelations(entity, RELATION_PART_OF, {
      kind: 'system',
    });
    const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);

    return {
      entity,
      resolved: {
        name: formatEntityRefTitle(entity, {
          defaultKind: 'Component',
        }),
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

  const typeColumn = columns.find(c => c.title === 'Type');
  if (typeColumn) {
    typeColumn.hidden = view !== 'Other';
  }

  return (
    <Table<EntityRow>
      isLoading={loading}
      columns={columns}
      options={{
        paging: true,
        pageSize: 20,
        actionsColumnIndex: -1,
        loadingType: 'linear',
        showEmptyDataSourceMessage: !loading,
        padding: 'dense',
        pageSizeOptions: [20, 50, 100],
      }}
      title={`${titlePreamble} (${(entities && entities.length) || 0})`}
      data={rows}
      actions={actions}
    />
  );
};
