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
import { Table, TableColumn } from '@backstage/core';
import {
  RollbarFrameworkId,
  RollbarLevel,
  RollbarTopActiveItem,
} from '../../api/types';
import { RollbarTrendGraph } from '../RollbarTrendGraph/RollbarTrendGraph';

const columns: TableColumn[] = [
  {
    title: 'ID',
    field: 'item.counter',
    type: 'string',
    align: 'left',
    width: '70px',
  },
  {
    title: 'Title',
    field: 'item.title',
    type: 'string',
    align: 'left',
  },
  {
    title: 'Trend',
    sorting: false,
    render: data => (
      <RollbarTrendGraph counts={(data as RollbarTopActiveItem).counts} />
    ),
  },
  {
    title: 'Occurrences',
    field: 'item.occurrences',
    type: 'numeric',
    align: 'right',
  },
  {
    title: 'Environment',
    field: 'item.environment',
    type: 'string',
  },
  {
    title: 'Level',
    field: 'item.level',
    type: 'string',
    render: data => RollbarLevel[(data as RollbarTopActiveItem).item.level],
  },
  {
    title: 'Framework',
    field: 'item.framework',
    type: 'string',
    render: data =>
      RollbarFrameworkId[(data as RollbarTopActiveItem).item.framework],
  },
  {
    title: 'Last Occurrence',
    field: 'item.lastOccurrenceTimestamp',
    type: 'datetime',
    render: data =>
      new Date(
        (data as RollbarTopActiveItem).item.lastOccurrenceTimestamp * 1000,
      ).toLocaleDateString(),
  },
];

type Props = {
  items: RollbarTopActiveItem[];
  loading: boolean;
};

export const RollbarTopItemsTable = ({ items, loading }: Props) => {
  return (
    <Table
      isLoading={loading}
      columns={columns}
      options={{
        padding: 'dense',
        paging: false,
        search: true,
        showEmptyDataSourceMessage: !loading,
      }}
      title="Top Active Items"
      data={items}
    />
  );
};
