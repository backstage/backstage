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

import React, { useContext } from 'react';
import { PodDrawer } from './PodDrawer';
import {
  containersReady,
  containerStatuses,
  podStatusToCpuUtil,
  podStatusToMemoryUtil,
  totalRestarts,
} from '../../utils/pod';
import { Table, TableColumn } from '@backstage/core-components';
import { PodNamesWithMetricsContext } from '../../hooks/PodNamesWithMetrics';
import { ClusterContext } from '../../hooks/Cluster';
import { useMatchingErrors } from '../../hooks/useMatchingErrors';
import { Pod } from 'kubernetes-models/v1/Pod';
import { V1Pod } from '@kubernetes/client-node';

export const READY_COLUMNS: PodColumns = 'READY';
export const RESOURCE_COLUMNS: PodColumns = 'RESOURCE';
export type PodColumns = 'READY' | 'RESOURCE';

type PodsTablesProps = {
  pods: Pod | V1Pod[];
  extraColumns?: PodColumns[];
  children?: React.ReactNode;
};

const READY: TableColumn<Pod>[] = [
  {
    title: 'containers ready',
    align: 'center',
    render: containersReady,
    width: 'auto',
  },
  {
    title: 'total restarts',
    align: 'center',
    render: totalRestarts,
    type: 'numeric',
    width: 'auto',
  },
];

const PodDrawerTrigger = ({ pod }: { pod: Pod }) => {
  const cluster = useContext(ClusterContext);
  const errors = useMatchingErrors({
    kind: 'Pod',
    apiVersion: 'v1',
    metadata: pod.metadata,
  });
  return (
    <PodDrawer
      podAndErrors={{
        pod: pod as any,
        clusterName: cluster.name,
        errors: errors,
      }}
    />
  );
};

export const PodsTable = ({ pods, extraColumns = [] }: PodsTablesProps) => {
  const podNamesWithMetrics = useContext(PodNamesWithMetricsContext);
  const defaultColumns: TableColumn<Pod>[] = [
    {
      title: 'name',
      highlight: true,
      render: (pod: Pod) => {
        return <PodDrawerTrigger pod={pod} />;
      },
    },
    {
      title: 'phase',
      render: (pod: Pod) => pod.status?.phase ?? 'unknown',
      width: 'auto',
    },
    {
      title: 'status',
      render: containerStatuses,
    },
  ];
  const columns: TableColumn<Pod>[] = [...defaultColumns];

  if (extraColumns.includes(READY_COLUMNS)) {
    columns.push(...READY);
  }
  if (extraColumns.includes(RESOURCE_COLUMNS)) {
    const resourceColumns: TableColumn<Pod>[] = [
      {
        title: 'CPU usage %',
        render: (pod: Pod) => {
          const metrics = podNamesWithMetrics.get(pod.metadata?.name ?? '');

          if (!metrics) {
            return 'unknown';
          }

          return podStatusToCpuUtil(metrics);
        },
        width: 'auto',
      },
      {
        title: 'Memory usage %',
        render: (pod: Pod) => {
          const metrics = podNamesWithMetrics.get(pod.metadata?.name ?? '');

          if (!metrics) {
            return 'unknown';
          }

          return podStatusToMemoryUtil(metrics);
        },
        width: 'auto',
      },
    ];
    columns.push(...resourceColumns);
  }

  const tableStyle = {
    minWidth: '0',
    width: '100%',
  };

  return (
    <div style={tableStyle}>
      <Table
        options={{ paging: true, search: false, emptyRowsWhenPaging: false }}
        data={pods as Pod[]}
        columns={columns}
      />
    </div>
  );
};
