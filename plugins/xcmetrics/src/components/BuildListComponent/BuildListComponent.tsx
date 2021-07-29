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
import React, { useEffect, useRef, useState } from 'react';
import { Table, TableColumn } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { Build, xcmetricsApiRef } from '../../api';
import { formatDuration, formatTime } from '../../utils';
import { Chip, Grid } from '@material-ui/core';
import {
  ActiveFilters,
  BuildListFilterComponent as Filters,
} from '../BuildListFilterComponent';
import { DateTime } from 'luxon';

const columns: TableColumn<Build>[] = [
  {
    title: 'Status',
    field: 'buildStatus',
  },
  {
    title: 'Project',
    field: 'projectName',
  },
  {
    title: 'Schema',
    field: 'schema',
  },
  {
    title: 'Started',
    field: 'startedAt',
    searchable: false,
    render: data => formatTime(data.startTimestamp),
  },
  {
    title: 'Duration',
    field: 'duration',
    render: data => formatDuration(data.duration),
  },
  {
    title: 'User',
    field: 'userid',
  },
  {
    field: 'isCI',
    render: data => data.isCi && <Chip label="CI" size="small" />,
    width: '10',
    sorting: false,
  },
];

export const BuildListComponent = () => {
  const initDates = {
    from: DateTime.now().minus({ year: 1 }).toISODate(),
    to: DateTime.now().toISODate(),
  };
  const client = useApi(xcmetricsApiRef);
  const tableRef = useRef<any>();
  const [filters, setFilters] = useState<ActiveFilters>(initDates);

  useEffect(() => tableRef.current?.onQueryChange(), [filters]);

  return (
    <Grid container spacing={3} direction="column">
      <Filters onFilterChange={setFilters} initDates={initDates} />
      <Table
        tableRef={tableRef}
        options={{ paging: true, sorting: false, search: false, pageSize: 10 }}
        data={query => {
          return new Promise((resolve, reject) => {
            if (!query) return;
            client
              .getFilteredBuilds(
                filters.from,
                filters.to,
                filters.buildStatus,
                query.page + 1, // Page starts at 1 in API
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
        columns={columns}
        title="Builds"
      />
    </Grid>
  );
};
