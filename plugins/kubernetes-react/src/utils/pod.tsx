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
  V1Pod,
  V1PodCondition,
  V1DeploymentCondition,
} from '@kubernetes/client-node';
import React, { Fragment, ReactNode } from 'react';
import Chip from '@material-ui/core/Chip';
import {
  StatusAborted,
  StatusError,
  StatusOK,
  SubvalueCell,
} from '@backstage/core-components';
import { ClientPodStatus } from '@backstage/plugin-kubernetes-common';
import { Pod } from 'kubernetes-models/v1/Pod';
import { bytesToMiB, formatMillicores } from './resources';

export const imageChips = (pod: V1Pod): ReactNode => {
  const containerStatuses = pod.status?.containerStatuses ?? [];
  const images = containerStatuses.map((cs, i) => {
    return <Chip key={i} label={`${cs.name}=${cs.image}`} size="small" />;
  });

  return <div>{images}</div>;
};

export const containersReady = (pod: Pod): string => {
  const containerStatuses = pod.status?.containerStatuses ?? [];
  const containersReadyItem = containerStatuses.filter(cs => cs.ready).length;

  return `${containersReadyItem}/${containerStatuses.length}`;
};

export const totalRestarts = (pod: Pod): number => {
  const containerStatuses = pod.status?.containerStatuses ?? [];
  return containerStatuses?.reduce((a, b) => a + b.restartCount, 0);
};

export const containerStatuses = (pod: Pod): ReactNode => {
  const containerStatusesItem = pod.status?.containerStatuses ?? [];
  const errors = containerStatusesItem.reduce((accum, next) => {
    if (next.state === undefined) {
      return accum;
    }

    const waiting = next.state.waiting;
    const terminated = next.state.terminated;

    const renderCell = (reason: string | undefined) => (
      <Fragment key={`${pod.metadata?.name}-${next.name}`}>
        <SubvalueCell
          value={
            reason === 'Completed' ? (
              <StatusOK>Container: {next.name}</StatusOK>
            ) : (
              <StatusError>Container: {next.name}</StatusError>
            )
          }
          subvalue={reason}
        />
        <br />
      </Fragment>
    );

    if (waiting) {
      accum.push(renderCell(waiting.reason));
    }

    if (terminated) {
      accum.push(renderCell(terminated.reason));
    }

    return accum;
  }, [] as React.ReactNode[]);

  if (errors.length === 0) {
    return <StatusOK>OK</StatusOK>;
  }

  return errors;
};

export const renderCondition = (
  condition: V1PodCondition | V1DeploymentCondition,
): [string, ReactNode] => {
  const status = condition.status;

  if (status === 'True') {
    return [condition.type, <StatusOK>True</StatusOK>];
  } else if (status === 'False') {
    return [
      condition.type,
      <SubvalueCell
        value={<StatusError>False</StatusError>}
        subvalue={condition.message ?? ''}
      />,
    ];
  }
  return [condition.type, <StatusAborted />];
};

// visible for testing
export const currentToDeclaredResourceToPerc = (
  current: number | string,
  resource: number | string,
): string => {
  if (Number(resource) === 0) return `0%`;

  if (typeof current === 'number' && typeof resource === 'number') {
    return `${Math.round((current / resource) * 100)}%`;
  }

  const numerator: bigint = BigInt(
    typeof current === 'number' ? Math.round(current) : current,
  );
  const denominator: bigint = BigInt(
    typeof resource === 'number' ? Math.round(resource) : resource,
  );

  return `${(numerator * BigInt(100)) / denominator}%`;
};

export const podStatusToCpuUtil = (podStatus: ClientPodStatus): ReactNode => {
  const cpuUtil = podStatus.cpu;

  let currentUsage: number | string = cpuUtil.currentUsage;

  // current usage number for CPU is a different unit than request/limit total
  // this might be a bug in the k8s library
  if (typeof cpuUtil.currentUsage === 'number') {
    currentUsage = cpuUtil.currentUsage / 10;
  }

  return (
    <SubvalueCell
      value={`requests: ${currentToDeclaredResourceToPerc(
        currentUsage,
        cpuUtil.requestTotal,
      )} of ${formatMillicores(cpuUtil.requestTotal)}`}
      subvalue={`limits: ${currentToDeclaredResourceToPerc(
        currentUsage,
        cpuUtil.limitTotal,
      )} of ${formatMillicores(cpuUtil.limitTotal)}`}
    />
  );
};

export const podStatusToMemoryUtil = (
  podStatus: ClientPodStatus,
): ReactNode => {
  const memUtil = podStatus.memory;

  return (
    <SubvalueCell
      value={`requests: ${currentToDeclaredResourceToPerc(
        memUtil.currentUsage,
        memUtil.requestTotal,
      )} of ${bytesToMiB(memUtil.requestTotal)}`}
      subvalue={`limits: ${currentToDeclaredResourceToPerc(
        memUtil.currentUsage,
        memUtil.limitTotal,
      )} of ${bytesToMiB(memUtil.limitTotal)}`}
    />
  );
};
