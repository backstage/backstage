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

import React, { useState } from 'react';
import { SentryIssue } from '../../api';
import { DateTime, Duration } from 'luxon';
import { ErrorCell } from '../ErrorCell/ErrorCell';
import { ErrorGraph } from '../ErrorGraph/ErrorGraph';
import {
  Table,
  TableColumn,
  Select,
  SelectedItems,
} from '@backstage/core-components';
import { Options } from '@material-table/core';

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
  const [filteredIssues, setFilteredIssues] = useState(sentryIssues);

  const handleFilterChange = (item: SelectedItems) => {
    if (item === Number.NEGATIVE_INFINITY) {
      setFilteredIssues(sentryIssues);
      return;
    }
    if (typeof item === 'number') {
      setFilteredIssues(
        sentryIssues.filter(
          i =>
            DateTime.fromISO(i.lastSeen) >
            DateTime.now().minus(Duration.fromMillis(item)),
        ),
      );
    }
  };
  return (
    <>
      <Select
        selected={14 * 86400000}
        onChange={handleFilterChange}
        items={[
          { label: '24H', value: 86400000 },
          { label: '7D', value: 7 * 86400000 },
          { label: '14D', value: 14 * 86400000 },
          { label: 'All', value: Number.NEGATIVE_INFINITY },
        ]}
      />
      <Table
        columns={columns}
        options={tableOptions}
        title="Sentry issues"
        subtitle={statsFor ? `Stat for ${statsFor}` : undefined}
        data={filteredIssues}
      />
    </>
  );
};

export default SentryIssuesTable;
