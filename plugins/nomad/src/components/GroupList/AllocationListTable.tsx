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

import {
  Link,
  StatusError,
  StatusOK,
  StatusPending,
  StatusRunning,
  Table,
  TableColumn,
} from '@backstage/core-components';
import React from 'react';
import { Allocation } from '../../api';

const columns: TableColumn<Allocation & { nomadAddr: string }>[] = [
  {
    title: 'ID',
    render: row => (
      <Link to={`${row.nomadAddr}/ui/allocations/${row.ID}`} underline="always">
        {row.ID.split('-')[0]}
      </Link>
    ),
  },
  {
    title: 'Task Group',
    render: row => (
      <Link
        to={`${row.nomadAddr}/ui/jobs/${row.JobID}/${row.TaskGroup}`}
        underline="always"
      >
        {row.TaskGroup}
      </Link>
    ),
  },
  {
    title: 'Created',
    render: row => new Date(row.CreateTime / 1000000).toLocaleString(),
  },
  {
    title: 'Status',
    render: row =>
      ({
        pending: <StatusPending>pending</StatusPending>,
        running: <StatusOK>running</StatusOK>,
        failed: <StatusError>failed</StatusError>,
        complete: <StatusRunning>complete</StatusRunning>,
      }[row.ClientStatus] || <text>{row.ClientStatus}</text>),
  },
  {
    title: 'Version',
    render: row => row.JobVersion,
  },
  {
    title: 'Client',
    render: row => (
      <Link to={`${row.nomadAddr}/ui/clients/${row.NodeID}`} underline="always">
        {row.ID.split('-')[0]}
      </Link>
    ),
  },
];

/**
 * AllocationListTable is roughly based off Nomad's Allocations tab's view.
 */
export const AllocationListTable = (props: {
  allocations: Allocation[];
  nomadAddr: string;
}) => (
  <Table
    options={{
      paging: false,
      toolbar: false,
    }}
    columns={columns}
    data={props.allocations.map(allocation => ({
      ...allocation,
      id: allocation.ID,
      nomadAddr: props.nomadAddr,
    }))}
  />
);
