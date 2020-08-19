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
import { Entity, LocationSpec } from '@backstage/catalog-model';
import { Table, TableColumn, TableProps } from '@backstage/core';
import { Link, Chip } from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import GitHub from '@material-ui/icons/GitHub';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { generatePath, Link as RouterLink } from 'react-router-dom';
import { findLocationForEntityMeta } from '../../data/utils';
import { useStarredEntities } from '../../hooks/useStarredEntites';
import { entityRoute } from '../../routes';
import {
  favouriteEntityIcon,
  favouriteEntityTooltip,
} from '../FavouriteEntity/FavouriteEntity';

const columns: TableColumn<Entity>[] = [
  {
    title: 'Name',
    field: 'metadata.name',
    highlight: true,
    render: (entity: any) => (
      <Link
        component={RouterLink}
        to={generatePath(entityRoute.path, {
          optionalNamespaceAndName: [
            entity.metadata.namespace,
            entity.metadata.name,
          ]
            .filter(Boolean)
            .join(':'),
          kind: entity.kind,
          selectedTabId: 'overview',
        })}
      >
        {entity.metadata.name}
      </Link>
    ),
  },
  {
    title: 'Owner',
    field: 'spec.owner',
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
    render: (entity: Entity) => (
      <>
        {entity.metadata.tags &&
          entity.metadata.tags.map(t => (
            <Chip label={t} color="secondary" style={{ marginBottom: '0px' }} />
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
        icon: () => <GitHub fontSize="small" />,
        tooltip: 'View on GitHub',
        onClick: () => {
          if (!location) return;
          window.open(location.target, '_blank');
        },
        hidden: location?.type !== 'github',
      };
    },
    (rowData: Entity) => {
      const createEditLink = (location: LocationSpec): string => {
        switch (location.type) {
          case 'github':
            return location.target.replace('/blob/', '/edit/');
          default:
            return location.target;
        }
      };
      const location = findLocationForEntityMeta(rowData.metadata);
      return {
        icon: () => <Edit fontSize="small" />,
        tooltip: 'Edit',
        onClick: () => {
          if (!location) return;
          window.open(createEditLink(location), '_blank');
        },
        hidden: location?.type !== 'github',
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

  return (
    <Table<Entity>
      isLoading={loading}
      columns={columns}
      options={{
        paging: false,
        actionsColumnIndex: -1,
        loadingType: 'linear',
        showEmptyDataSourceMessage: !loading,
      }}
      title={`${titlePreamble} (${(entities && entities.length) || 0})`}
      data={entities}
      actions={actions}
    />
  );
};
