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

import React from 'react';
import { Link as RouterLink, generatePath } from 'react-router-dom';
import { Table, TableColumn } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { Link } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { entityRouteRef } from '../../routes';

const columns: TableColumn[] = [
  {
    title: 'Name',
    field: 'metadata.name',
    type: 'string',
    highlight: true,
    render: (entity: any) => (
      <Link
        component={RouterLink}
        to={generatePath(entityRouteRef.path, {
          optionalNamespaceAndName: [
            entity.metadata.namespace,
            entity.metadata.name,
          ]
            .filter(Boolean)
            .join(':'),
          kind: entity.kind,
        })}
      >
        {entity.metadata.name}
      </Link>
    ),
  },
  {
    title: 'Description',
    field: 'metadata.description',
  },
];

type Props = {
  entities: Entity[];
  loading: boolean;
  error?: any;
};

export const RollbarProjectTable = ({ entities, loading, error }: Props) => {
  if (error) {
    return (
      <div>
        <Alert severity="error">
          Error encountered while fetching rollbar projects. {error.toString()}
        </Alert>
      </div>
    );
  }

  return (
    <Table
      isLoading={loading}
      columns={columns}
      options={{
        search: true,
        paging: true,
        pageSize: 10,
        showEmptyDataSourceMessage: !loading,
      }}
      title="Projects"
      data={entities}
    />
  );
};
