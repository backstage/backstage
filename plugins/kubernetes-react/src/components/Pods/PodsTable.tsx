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

import { ReactNode, useContext } from 'react';
import { PodDrawer } from './PodDrawer';
import {
  containersReady,
  containerStatuses,
  parseImageTag,
  podStatusToCpuUtil,
  podStatusToMemoryUtil,
  totalRestarts,
} from '../../utils/pod';
import { Table, TableColumn } from '@backstage/core-components';
import { ClusterContext } from '../../hooks/Cluster';
import { useMatchingErrors } from '../../hooks/useMatchingErrors';
import { Pod } from 'kubernetes-models/v1/Pod';
import type { V1Pod } from '@kubernetes/client-node';
import { usePodMetrics } from '../../hooks/usePodMetrics';
import Typography from '@material-ui/core/Typography';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { kubernetesReactTranslationRef } from '../../translation';

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
 * A column to render in the pods table.
 *
 * Can either be one of the `PodColumns` presets, or a custom
 * `TableColumn<T>`, matching the row type `T` passed to the `pods`
 * prop of `PodsTable`.
 *
 * @public
 */
export type PodExtraColumn<T extends Pod | V1Pod = Pod> =
  | PodColumns
  | TableColumn<T>;

/**
 *
 *
 * @public
 */
export type PodsTablesProps<T extends Pod | V1Pod = V1Pod> =
  | {
      pods: T[];
      extraColumns?: PodExtraColumn<T>[];
      children?: ReactNode;
    }
  | {
      pods: Pod;
      extraColumns?: PodExtraColumn<Pod>[];
      children?: ReactNode;
    };

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
  const { t } = useTranslationRef(kubernetesReactTranslationRef);

  if (!metrics) {
    return <Typography>{t('podsTable.unknown')}</Typography>;
  }

  return <>{podStatusToCpuUtil(metrics)}</>;
};

const Memory = ({ clusterName, pod }: { clusterName: string; pod: Pod }) => {
  const metrics = usePodMetrics(clusterName, pod);
  const { t } = useTranslationRef(kubernetesReactTranslationRef);

  if (!metrics) {
    return <Typography>{t('podsTable.unknown')}</Typography>;
  }

  return <>{podStatusToMemoryUtil(metrics)}</>;
};

/**
 *
 *
 * @public
 */
export const PodsTable = <T extends Pod | V1Pod = V1Pod>({
  pods,
  extraColumns = [],
}: PodsTablesProps<T>) => {
  const cluster = useContext(ClusterContext);
  const { t } = useTranslationRef(kubernetesReactTranslationRef);

  const READY: TableColumn<Pod>[] = [
    {
      title: t('podsTable.columns.containersReady'),
      align: 'center',
      render: containersReady,
      width: 'auto',
    },
    {
      title: t('podsTable.columns.totalRestarts'),
      align: 'center',
      render: totalRestarts,
      type: 'numeric',
      width: 'auto',
    },
  ];

  const defaultColumns: TableColumn<Pod>[] = [
    {
      title: t('podsTable.columns.id'),
      field: 'metadata.uid',
      hidden: true,
    },
    {
      title: t('podsTable.columns.name'),
      highlight: true,
      render: (pod: Pod) => {
        return <PodDrawerTrigger pod={pod} />;
      },
    },
    {
      title: t('podsTable.columns.phase'),
      render: (pod: Pod) => pod.status?.phase ?? t('podsTable.unknown'),
      width: 'auto',
    },
    {
      title: t('podsTable.columns.status'),
      render: containerStatuses,
    },
    {
      title: t('podsTable.columns.version'),
      render: (pod: Pod) => {
        const containers = pod.spec?.containers ?? [];
        const tags = containers.map(container => ({
          name: container.name,
          tag: parseImageTag(container.image) ?? t('podsTable.unknown'),
        }));
        if (tags.length === 0) {
          return t('podsTable.unknown');
        }
        // Only qualify the tag with the container name when there's more
        // than one container, so a single-container pod (the common case)
        // keeps showing a plain version string.
        if (tags.length === 1) {
          return tags[0].tag;
        }
        return tags.map(({ name, tag }) => `${name}: ${tag}`).join(', ');
      },
      width: 'auto',
    },
  ];
  const resourceColumns: TableColumn<Pod>[] = [
    {
      title: t('podsTable.columns.cpuUsage'),
      render: (pod: Pod) => {
        return <Cpu clusterName={cluster.name} pod={pod} />;
      },
      width: 'auto',
    },
    {
      title: t('podsTable.columns.memoryUsage'),
      render: (pod: Pod) => {
        return <Memory clusterName={cluster.name} pod={pod} />;
      },
      width: 'auto',
    },
  ];

  const columnsByPreset: Record<PodColumns, TableColumn<Pod>[]> = {
    [READY_COLUMNS]: READY,
    [RESOURCE_COLUMNS]: resourceColumns,
  };

  // The built-in columns above always operate on rows normalized to `Pod`
  // (see the `data` mapping below), regardless of the row type `T` selected
  // by the caller, so a single cast at this boundary is safe. Custom columns
  // supplied via `extraColumns`, on the other hand, are already declared as
  // `TableColumn<T>` and require no cast.
  const columns: TableColumn<T>[] = [
    ...(defaultColumns as unknown as TableColumn<T>[]),
  ];
  for (const extraColumn of extraColumns as PodExtraColumn<T>[]) {
    if (typeof extraColumn === 'string') {
      columns.push(
        ...(columnsByPreset[extraColumn] as unknown as TableColumn<T>[]),
      );
    } else {
      columns.push(extraColumn);
    }
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
          (Array.isArray(pods) ? (pods as Pod[]) : [pods as Pod]).map(
            (pod: Pod) => ({
              ...pod,
              id: pod?.metadata?.uid,
            }),
          ) as any as T[]
        }
        columns={columns}
      />
    </div>
  );
};
