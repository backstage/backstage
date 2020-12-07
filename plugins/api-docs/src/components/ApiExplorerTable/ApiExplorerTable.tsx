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

import { ApiEntityV1alpha1, Entity } from '@backstage/catalog-model';
import {
  Table,
  TableColumn,
  TableFilter,
  TableState,
  useQueryParamState,
} from '@backstage/core';
import { Chip } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { ApiTypeTitle } from '../ApiDefinitionCard';
import { EntityLink } from '../EntityLink';

const columns: TableColumn<Entity>[] = [
  {
    title: 'Name',
    field: 'metadata.name',
    highlight: true,
    render: (entity: any) => (
      <EntityLink entity={entity}>{entity.metadata.name}</EntityLink>
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
    title: 'Type',
    field: 'spec.type',
    render: (entity: Entity) => (
      <ApiTypeTitle apiEntity={entity as ApiEntityV1alpha1} />
    ),
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

const filters: TableFilter[] = [
  {
    column: 'Owner',
    type: 'select',
  },
  {
    column: 'Type',
    type: 'multiple-select',
  },
  {
    column: 'Lifecycle',
    type: 'multiple-select',
  },
  {
    column: 'Tags',
    type: 'checkbox-tree',
  },
];

type ExplorerTableProps = {
  entities: Entity[];
  loading: boolean;
  error?: any;
};

export const ApiExplorerTable = ({
  entities,
  loading,
  error,
}: ExplorerTableProps) => {
  const [queryParamState, setQueryParamState] = useQueryParamState<TableState>(
    'apiTable',
  );

  if (error) {
    return (
      <div>
        <Alert severity="error">
          Error encountered while fetching catalog entities. {error.toString()}
        </Alert>
      </div>
    );
  }

  return (
    <Table
      isLoading={loading}
      columns={columns}
      options={{
        paging: false,
        actionsColumnIndex: -1,
        loadingType: 'linear',
        padding: 'dense',
        showEmptyDataSourceMessage: !loading,
      }}
      data={entities}
      filters={filters}
      initialState={queryParamState}
      onStateChange={setQueryParamState}
    />
  );
};
