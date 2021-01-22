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
import { Table, TableColumn, TableProps } from '@backstage/core';
import { Chip, Link } from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { generatePath, Link as RouterLink } from 'react-router-dom';
import { findLocationForEntityMeta } from '../../data/utils';
import { useStarredEntities } from '../../hooks/useStarredEntities';
import { entityRoute, entityRouteParams } from '../../routes';
import { createEditLink } from '../createEditLink';
import { EntityRefLink, formatEntityRefTitle } from '../EntityRefLink';
import {
  favouriteEntityIcon,
  favouriteEntityTooltip,
} from '../FavouriteEntity/FavouriteEntity';
import { getEntityRelations } from '../getEntityRelations';

type EntityRow = Entity & {
  row: {
    partOfSystemRelationTitle?: string;
    partOfSystemRelation?: EntityName;
    ownedByRelationsTitle?: string;
    ownedByRelations: EntityName[];
  };
};

const columns: TableColumn<EntityRow>[] = [
  {
    title: 'Name',
    field: 'metadata.name',
    highlight: true,
    render: entity => (
      <Link
        component={RouterLink}
        to={generatePath(entityRoute.path, {
          ...entityRouteParams(entity),
          selectedTabId: 'overview',
        })}
      >
        {entity.metadata.name}
      </Link>
    ),
  },
  {
    title: 'System',
    field: 'row.partOfSystemRelationTitle',
    render: entity => (
      <>
        {entity.row.partOfSystemRelation && (
          <EntityRefLink
            entityRef={entity.row.partOfSystemRelation}
            defaultKind="system"
          />
        )}
      </>
    ),
  },
  {
    title: 'Owner',
    field: 'row.ownedByRelationsTitle',
    render: entity => (
      <>
        {entity.row.ownedByRelations.map((t, i) => (
          <React.Fragment key={i}>
            {i > 0 && ', '}
            <EntityRefLink entityRef={t} defaultKind="group" />
          </React.Fragment>
        ))}
      </>
    ),
  },
  {
    title: 'Lifecycle',
    field: 'spec.lifecycle',
  },
  {
    title: 'Description',
    field: 'metadata.description',
  },
  {
    title: 'Tags',
    field: 'metadata.tags',
    cellStyle: {
      padding: '0px 16px 0px 20px',
    },
    render: entity => (
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
};

export const CatalogTable = ({
  entities,
  loading,
  error,
  titlePreamble,
}: CatalogTableProps) => {
  const { isStarredEntity, toggleStarredEntity } = useStarredEntities();

  if (error) {
    return (
      <div>
        <Alert severity="error">
          Error encountered while fetching catalog entities. {error.toString()}
        </Alert>
      </div>
    );
  }

  const actions: TableProps<Entity>['actions'] = [
    (rowData: Entity) => {
      const location = findLocationForEntityMeta(rowData.metadata);
      return {
        icon: () => <OpenInNew fontSize="small" />,
        tooltip: 'View',
        onClick: () => {
          if (!location) return;
          window.open(location.target, '_blank');
        },
      };
    },
    (rowData: Entity) => {
      const location = findLocationForEntityMeta(rowData.metadata);
      return {
        icon: () => <Edit fontSize="small" />,
        tooltip: 'Edit',
        onClick: () => {
          if (!location) return;
          window.open(createEditLink(location), '_blank');
        },
      };
    },
    (rowData: Entity) => {
      const isStarred = isStarredEntity(rowData);
      return {
        cellStyle: { paddingLeft: '1em' },
        icon: () => favouriteEntityIcon(isStarred),
        tooltip: favouriteEntityTooltip(isStarred),
        onClick: () => toggleStarredEntity(rowData),
      };
    },
  ];

  const rows = entities.map(e => {
    const [partOfSystemRelation] = getEntityRelations(e, RELATION_PART_OF, {
      kind: 'system',
    });
    const ownedByRelations = getEntityRelations(e, RELATION_OWNED_BY);

    return {
      ...e,
      row: {
        ownedByRelationsTitle: ownedByRelations
          .map(r => formatEntityRefTitle(r, { defaultKind: 'group' }))
          .join(', '),
        ownedByRelations,
        partOfSystemRelationTitle: partOfSystemRelation
          ? formatEntityRefTitle(partOfSystemRelation, {
              defaultKind: 'system',
            })
          : undefined,
        partOfSystemRelation,
      },
    };
  });

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
