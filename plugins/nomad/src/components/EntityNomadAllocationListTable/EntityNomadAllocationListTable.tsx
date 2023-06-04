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
  MissingAnnotationEmptyState,
  ResponseErrorPanel,
  StatusError,
  StatusOK,
  StatusPending,
  StatusRunning,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import React, { useState } from 'react';
import { Allocation, nomadApiRef } from '../../api';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import {
  NOMAD_GROUP_ANNOTATION,
  NOMAD_JOB_ID_ANNOTATION,
  NOMAD_NAMESPACE_ANNOTATION,
  isNomadAllocationsAvailable,
} from '../../Router';
import useAsync from 'react-use/lib/useAsync';

type rowType = Allocation & { nomadAddr: string };

const columns: TableColumn<rowType>[] = [
  {
    title: 'ID',
    field: 'ID',
    render: row => (
      <Link to={`${row.nomadAddr}/ui/allocations/${row.ID}`} underline="always">
        {row.ID.split('-')[0]}
      </Link>
    ),
  },
  {
    title: 'Task Group',
    field: 'TaskGroup',
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
    field: 'CreateTime',
    render: row => new Date(row.CreateTime / 1000000).toLocaleString(),
  },
  {
    title: 'Status',
    field: 'ClientStatus',
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
    field: 'JobVersion',
    render: row => row.JobVersion,
  },
  {
    title: 'Client',
    field: 'NodeID',
    render: row => (
      <Link to={`${row.nomadAddr}/ui/clients/${row.NodeID}`} underline="always">
        {row.ID.split('-')[0]}
      </Link>
    ),
  },
];

/**
 * EntityNomadAllocationListTable is roughly based off Nomad's Allocations tab's view.
 */
export const EntityNomadAllocationListTable = () => {
  // Wait on entity
  const { entity } = useEntity();

  // Get ref to the backend API
  const [init, setInit] = useState(true);
  const configApi = useApi(configApiRef);
  const nomadApi = useApi(nomadApiRef);
  const nomadAddr = configApi.getString('nomad.addr');

  // Store results of calling API
  const [allocations, setAllocations] = useState<rowType[]>([]);
  const [err, setErr] = useState<Error>();

  // Check that attributes are available
  if (!isNomadAllocationsAvailable(entity)) {
    <MissingAnnotationEmptyState
      annotation={[NOMAD_JOB_ID_ANNOTATION, NOMAD_GROUP_ANNOTATION]}
    />;
  }

  // Get plugin attributes
  const namespace =
    entity.metadata.annotations?.[NOMAD_NAMESPACE_ANNOTATION] ?? 'default';
  const job = entity.metadata.annotations?.[NOMAD_JOB_ID_ANNOTATION] ?? '';
  const group = entity.metadata.annotations?.[NOMAD_GROUP_ANNOTATION] ?? '';

  // Make filter from attributes
  const filter: string[] = [];
  if (job) {
    filter.push(`(JobID == "${job}")`);
  }
  if (group) {
    filter.push(`(TaskGroup matches "${group}")`);
  }

  // Create a query to update allocations
  const query = async () => {
    try {
      // Make call to nomad-backend
      const resp = await nomadApi.listAllocations({
        namespace,
        filter: filter.join(' and '),
      });

      // Sort results
      const results = resp.allocations
        .sort((a, b) => a.CreateTime - b.CreateTime)
        .sort(({ ClientStatus: a }, { ClientStatus: b }) => {
          if (a === 'running' || b !== 'running') {
            return -1;
          }
          return 0;
        });

      setAllocations(results.map(row => ({ ...row, id: row.ID, nomadAddr })));
      setErr(undefined);
    } catch (e) {
      setAllocations([]);
      setErr(e);
    }
  };

  // Start querying for allocations every 5s
  useAsync(async () => {
    if (init) {
      setInit(false);
      query();
    }

    const interval = setTimeout(() => {
      query();
    }, 5_000);

    return () => clearTimeout(interval);
  }, [allocations, entity]);

  // Store a ref to a potential error
  if (err) {
    return <ResponseErrorPanel error={err} />;
  }

  return (
    <Table<rowType>
      title="Allocations"
      options={{
        search: true,
        padding: 'dense',
        sorting: true,
        draggable: false,
        paging: false,
        debounceInterval: 500,
        filterCellStyle: { padding: '0 16px 0 20px' },
      }}
      columns={columns}
      data={allocations}
    />
  );
};
