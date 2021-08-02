/*
 * Copyright 2021 The Backstage Authors
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
import React, { useRef, useState } from 'react';
import { Table } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { BuildFilters, xcmetricsApiRef } from '../../api';
import { Grid } from '@material-ui/core';
import { BuildListFilterComponent as Filters } from '../BuildListFilterComponent';
import { DateTime } from 'luxon';
import { buildPageColumns } from '../BuildTableColumns';

export const BuildListComponent = () => {
  const client = useApi(xcmetricsApiRef);
  const tableRef = useRef<any>();

  const initialFilters = {
    from: DateTime.now().minus({ year: 1 }).toISODate(),
    to: DateTime.now().toISODate(),
  };

  const [filters, setFilters] = useState<BuildFilters>(initialFilters);

  const handleFilterChange = (values: BuildFilters) => {
    setFilters(values);
    tableRef.current?.onQueryChange();
  };

  return (
    <Grid container spacing={3} direction="column">
      <Filters
        onFilterChange={handleFilterChange}
        initialValues={initialFilters}
      />
      <Table
        title="Builds"
        columns={buildPageColumns}
        options={{ paging: true, sorting: false, search: false, pageSize: 10 }}
        tableRef={tableRef}
        data={query => {
          return new Promise((resolve, reject) => {
            if (!query) return;
            client
              .getFilteredBuilds(
                filters,
                query.page + 1, // Page is 0-indexed in Table
                query.pageSize,
              )
              .then(result => {
                resolve({
                  data: result.items,
                  page: result.metadata.page - 1,
                  totalCount: result.metadata.total,
                });
              })
              .catch(reason => reject(reason));
          });
        }}
      />
    </Grid>
  );
};
