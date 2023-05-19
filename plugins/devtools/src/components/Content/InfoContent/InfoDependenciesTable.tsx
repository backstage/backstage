/*
 * Copyright 2022 The Backstage Authors
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

import { Table, TableColumn } from '@backstage/core-components';
import { PackageDependency } from '@backstage/plugin-devtools-common';

import React from 'react';

const columns: TableColumn[] = [
  {
    title: 'Name',
    width: 'auto',
    field: 'name',
    defaultSort: 'asc',
  },
  {
    title: 'Versions',
    width: 'auto',
    field: 'versions',
  },
];

export const InfoDependenciesTable = ({
  infoDependencies,
}: {
  infoDependencies: PackageDependency[] | undefined;
}) => {
  return (
    <Table
      title="Package Dependencies"
      options={{
        paging: true,
        pageSize: 15,
        pageSizeOptions: [15, 30, 100],
        loadingType: 'linear',
        padding: 'dense',
      }}
      columns={columns}
      data={infoDependencies || []}
    />
  );
};
