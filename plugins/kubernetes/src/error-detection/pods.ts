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

import { Pod, IContainerStatus, IContainer } from 'kubernetes-models/v1';
import { DetectedError, ErrorMapper } from './types';
import { detectErrorsInObjects } from './common';
import lodash from 'lodash';

function isPodReadinessProbeUnready({
  container,
  containerStatus,
}: ContainerSpecAndStatus): boolean {
  if (
    containerStatus.ready ||
    containerStatus.state?.running?.startedAt === undefined ||
    !container.readinessProbe
  ) {
    return false;
  }
  const startDateTime: Date = new Date(
    containerStatus.state?.running?.startedAt,
  );
  // Add initial delay
  startDateTime.setSeconds(
    startDateTime.getSeconds() +
      (container.readinessProbe?.initialDelaySeconds ?? 0),
  );
  // Add failure threshold
  startDateTime.setSeconds(
    startDateTime.getSeconds() +
      (container.readinessProbe?.periodSeconds ?? 0) *
        (container.readinessProbe?.failureThreshold ?? 0),
  );
  const now: Date = new Date();
  return startDateTime < now;
}

interface ContainerSpecAndStatus {
  container: IContainer;
  containerStatus: IContainerStatus;
}

const podToContainerSpecsAndStatuses = (pod: Pod): ContainerSpecAndStatus[] => {
  const specs = lodash.groupBy(pod.spec?.containers ?? [], value => value.name);

  const result: ContainerSpecAndStatus[] = [];

  for (const cs of pod.status?.containerStatuses ?? []) {
    const spec = specs[cs.name];
    if (spec.length > 0) {
      result.push({
        container: spec[0],
        containerStatus: cs,
      });
    }
  }

  return result;
};

const podErrorMappers: ErrorMapper<Pod>[] = [
  {
    detectErrors: pod => {
      return podToContainerSpecsAndStatuses(pod)
        .filter(isPodReadinessProbeUnready)
        .map(cs => ({
          type: 'readiness-probe-taking-too-long',
          message: `The container ${cs.container.name} failed to start properly, but is not crashing`,
          severity: 4,
          proposedFix: [], // TODO next PR
          sourceRef: {
            name: pod.metadata?.name ?? 'unknown pod',
            namespace: pod.metadata?.namespace ?? 'unknown namespace',
            kind: 'Pod',
            apiGroup: 'v1',
          },
          occuranceCount: 1,
        }));
    },
  },
  {
    detectErrors: pod => {
      return (pod.status?.containerStatuses ?? [])
        .filter(cs => cs.state?.waiting?.message !== undefined)
        .map(cs => ({
          type: 'container-waiting',
          message: cs.state?.waiting?.message ?? 'container waiting',
          severity: 4,
          proposedFix: [], // TODO next PR
          sourceRef: {
            name: pod.metadata?.name ?? 'unknown pod',
            namespace: pod.metadata?.namespace ?? 'unknown namespace',
            kind: 'Pod',
            apiGroup: 'v1',
          },
          occuranceCount: 1,
        }));
    },
  },
  {
    detectErrors: pod => {
      return (pod.status?.containerStatuses ?? [])
        .filter(cs => cs.restartCount > 0)
        .map(cs => ({
          type: 'containers-restarting',
          message: `container=${cs.name} restarted ${cs.restartCount} times`,
          severity: 4,
          proposedFix: [], // TODO next PR
          sourceRef: {
            name: pod.metadata?.name ?? 'unknown pod',
            namespace: pod.metadata?.namespace ?? 'unknown namespace',
            kind: 'Pod',
            apiGroup: 'v1',
          },
          occuranceCount: cs.restartCount,
        }));
    },
  },
];

export const detectErrorsInPods = (pods: Pod[]): DetectedError[] =>
  detectErrorsInObjects(pods, podErrorMappers);
