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
import Typography from '@material-ui/core/Typography';

/**
 *
 *
 * @public
 */
export const READY_COLUMNS: PodColumns = 'READY';

/**
 *
 *
 * @public
 */
export const RESOURCE_COLUMNS: PodColumns = 'RESOURCE';

/**
 *
 *
 * @public
 */
export type PodColumns = 'READY' | 'RESOURCE';

/**
 *
 *
 * @public
 */
export type PodsTablesProps = {
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
  const errors = useMatchingErrors({
    kind: 'Pod',
    apiVersion: 'v1',
    metadata: pod.metadata,
  });
  return (
    <PodDrawer
      podAndErrors={{
        pod: pod as any,
        cluster: useContext(ClusterContext),
        errors: errors,
      }}
    />
  );
};

const Cpu = ({ clusterName, pod }: { clusterName: string; pod: Pod }) => {
  const metrics = usePodMetrics(clusterName, pod);

  if (!metrics) {
    return <Typography>unknown</Typography>;
  }

  return <>{podStatusToCpuUtil(metrics)}</>;
};

const Memory = ({ clusterName, pod }: { clusterName: string; pod: Pod }) => {
  const metrics = usePodMetrics(clusterName, pod);

  if (!metrics) {
    return <Typography>unknown</Typography>;
  }

  return <>{podStatusToMemoryUtil(metrics)}</>;
};

/**
 *
 *
 * @public
 */
export const PodsTable = ({ pods, extraColumns = [] }: PodsTablesProps) => {
  const cluster = useContext(ClusterContext);
  const defaultColumns: TableColumn<Pod>[] = [
    {
      title: 'ID',
      field: 'metadata.uid',
      hidden: true,
    },
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
        // It was observed that in some instances the pod drawer closes when new data (like CPU usage) is available and the table reloads.
        // Mapping the metadata UID to the tables ID fixes this problem.
        data={
          (pods as Pod[]).map((pod: Pod) => ({
            ...pod,
            id: pod?.metadata?.uid,
          })) as any as Pod[]
        }
        columns={columns}
      />
    </div>
  );
};
