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
import { Table, TableColumn } from '@backstage/core';
import { Link } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { FC } from 'react';
import { Link as RouterLink, generatePath } from 'react-router-dom';
import { Component } from '../../data/component';

import { entityRoute } from '../../routes';

const columns: TableColumn[] = [
  {
    title: 'Name',
    field: 'name',
    highlight: true,
    render: (componentData: any) => (
      <Link
        component={RouterLink}
        to={generatePath(entityRoute.path, {
          optionalNamespaceAndName: [
            componentData.namespace,
            componentData.name,
          ]
            .filter(Boolean)
            .join(':'),
          kind: componentData.kind,
        })}
      >
        {componentData.name}
      </Link>
    ),
  },
  {
    title: 'Kind',
    field: 'kind',
  },
  {
    title: 'Description',
    field: 'description',
  },
];

type CatalogTableProps = {
  components: Component[];
  titlePreamble: string;
  loading: boolean;
  error?: any;
  actions?: any;
};

const CatalogTable: FC<CatalogTableProps> = ({
  components,
  loading,
  error,
  titlePreamble,
  actions,
}) => {
  if (error) {
    return (
      <div>
        <Alert severity="error">
          Error encountered while fetching components. {error.toString()}
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
        showEmptyDataSourceMessage: !loading,
      }}
      title={`${titlePreamble} (${(components && components.length) || 0})`}
      data={components}
      actions={actions}
    />
  );
};

export default CatalogTable;
