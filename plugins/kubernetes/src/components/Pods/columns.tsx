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

import React from 'react';
import { V1Pod } from '@kubernetes/client-node';
import { TableColumn } from '@backstage/core-components';
import { PodDrawer } from './PodDrawer';
import {
  containersReady,
  containerStatuses,
  podStatusToCpuUtil,
  podStatusToMemoryUtil,
  totalRestarts,
} from '../../utils/pod';

export function createNameColumn(): TableColumn<V1Pod> {
  return {
    title: 'name',
    highlight: true,
    render: (pod: V1Pod) => <PodDrawer pod={pod} />,
  };
}

export function createPhaseColumn(): TableColumn<V1Pod> {
  return {
    title: 'phase',
    render: (pod: V1Pod) => pod.status?.phase ?? 'unknown',
  };
}
export function createContainersReadyColumn(): TableColumn<V1Pod> {
  return {
    title: 'containers ready',
    align: 'center',
    render: containersReady,
  };
}

export function createTotalRestartsColumn(): TableColumn<V1Pod> {
  return {
    title: 'total restarts',
    align: 'center',
    render: totalRestarts,
    type: 'numeric',
  };
}

export function createStatusColumn(): TableColumn<V1Pod> {
  return {
    title: 'status',
    render: containerStatuses,
  };
}

export function createCPUUsageColumn(
  podNamesWithMetrics: object,
): TableColumn<V1Pod> {
  return {
    title: 'CPU usage %',
    render: (pod: V1Pod) => {
      const metrics = podNamesWithMetrics.get(pod.metadata?.name ?? '');

      if (!metrics) {
        return 'unknown';
      }

      return podStatusToCpuUtil(metrics);
    },
  };
}

export function createMemoryUsageColumn(
  podNamesWithMetrics: object,
): TableColumn<V1Pod> {
  return {
    title: 'Memory usage %',
    render: (pod: V1Pod) => {
      const metrics = podNamesWithMetrics.get(pod.metadata?.name ?? '');

      if (!metrics) {
        return 'unknown';
      }

      return podStatusToMemoryUtil(metrics);
    },
  };
}
