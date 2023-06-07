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
import { ClusterContext } from '../../hooks/Cluster';
import { useMatchingErrors } from '../../hooks/useMatchingErrors';
import { Pod } from 'kubernetes-models/v1/Pod';
import { V1Pod } from '@kubernetes/client-node';
import { usePodMetrics } from '../../hooks/usePodMetrics';

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

const Cpu = ({ clusterName, pod }: { clusterName: string; pod: Pod }) => {
  const metrics = usePodMetrics(clusterName, pod);

  if (!metrics) {
    return <p>unknown</p>;
  }

  return <>{podStatusToCpuUtil(metrics)}</>;
};

const Memory = ({ clusterName, pod }: { clusterName: string; pod: Pod }) => {
  const metrics = usePodMetrics(clusterName, pod);

  if (!metrics) {
    return <p>unknown</p>;
  }

  return <>{podStatusToMemoryUtil(metrics)}</>;
};

export const PodsTable = ({ pods, extraColumns = [] }: PodsTablesProps) => {
  const cluster = useContext(ClusterContext);
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
          return <Cpu clusterName={cluster.name} pod={pod} />;
        },
        width: 'auto',
      },
      {
        title: 'Memory usage %',
        render: (pod: Pod) => {
          return <Memory clusterName={cluster.name} pod={pod} />;
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
