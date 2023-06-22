/*
 * Copyright 2020 The Backstage Authors
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

import React, { useCallback, useState } from 'react';
import { SentryIssue } from '../../api';
import { DateTime, Duration } from 'luxon';
import { ErrorCell } from '../ErrorCell/ErrorCell';
import { ErrorGraph } from '../ErrorGraph/ErrorGraph';
import { Table, TableColumn } from '@backstage/core-components';
import Select from '@material-ui/core/Select';
import { Options } from '@material-table/core';
import { FormControl, Grid, MenuItem } from '@material-ui/core';

const ONE_DAY_IN_MILLIS = 86400000;
const SEVEN_DAYS_IN_MILLIS = ONE_DAY_IN_MILLIS * 7;
const FOURTEEN_DAYS_IN_MILLIS = ONE_DAY_IN_MILLIS * 14;

const columns: TableColumn[] = [
  {
    title: 'Error',
    render: data => <ErrorCell sentryIssue={data as SentryIssue} />,
  },
  {
    title: 'Graph',
    render: data => <ErrorGraph sentryIssue={data as SentryIssue} />,
  },
  {
    title: 'First seen',
    field: 'firstSeen',
    render: data => {
      const { firstSeen } = data as SentryIssue;

      return DateTime.fromISO(firstSeen).toRelative({ locale: 'en' });
    },
  },
  {
    title: 'Last seen',
    field: 'lastSeen',
    render: data => {
      const { lastSeen } = data as SentryIssue;
      return DateTime.fromISO(lastSeen).toRelative({ locale: 'en' });
    },
  },
  {
    title: 'Events',
    field: 'count',
  },
  {
    title: 'Users',
    field: 'userCount',
  },
];

type SentryIssuesTableProps = {
  sentryIssues: SentryIssue[];
  statsFor: '24h' | '14d' | '';
  tableOptions: Options<never>;
};

const SentryIssuesTable = (props: SentryIssuesTableProps) => {
  const { sentryIssues, statsFor, tableOptions } = props;
  const [selected, setSelected] = useState(ONE_DAY_IN_MILLIS);

  const filterByDate = useCallback(
    (issue: SentryIssue, selectedFilter: number) => {
      return (
        DateTime.fromISO(issue.lastSeen) >
        DateTime.now().minus(Duration.fromMillis(selectedFilter))
      );
    },
    [],
  );
  const [filteredIssues, setFilteredIssues] = useState(
    sentryIssues.filter(i => filterByDate(i, selected)),
  );

  const handleFilterChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    const item = event.target.value;
    if (typeof item === 'number') {
      setSelected(item);
      if (item === Number.NEGATIVE_INFINITY) {
        setFilteredIssues(sentryIssues);
        return;
      }
      setFilteredIssues(sentryIssues.filter(i => filterByDate(i, item)));
    }
  };
  return (
    <>
      <Table
        columns={columns}
        options={tableOptions}
        title={
          <Grid container>
            <Grid item>Sentry Issues</Grid>
            <Grid item>
              <FormControl variant="outlined" size="small">
                <Select value={selected} onChange={handleFilterChange}>
                  <MenuItem value={ONE_DAY_IN_MILLIS}>24H</MenuItem>
                  <MenuItem value={SEVEN_DAYS_IN_MILLIS}>7D</MenuItem>
                  <MenuItem value={FOURTEEN_DAYS_IN_MILLIS}>14D</MenuItem>
                  <MenuItem value={Number.NEGATIVE_INFINITY}>All</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        }
        subtitle={statsFor ? `Stats for ${statsFor}` : undefined}
        data={filteredIssues}
      />
    </>
  );
};

export default SentryIssuesTable;
