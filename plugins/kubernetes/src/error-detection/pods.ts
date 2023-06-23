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
import { DetectedError, ErrorMapper, ProposedFix } from './types';
import { detectErrorsInObjects } from './common';
import lodash from 'lodash';
import { DateTime } from 'luxon';

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
  const startDateTime = DateTime.fromISO(
    containerStatus.state?.running?.startedAt,
  )
    // Add initial delay
    .plus({
      seconds: container.readinessProbe?.initialDelaySeconds ?? 0,
    })
    // Add failure threshold
    .plus({
      seconds:
        (container.readinessProbe?.periodSeconds ?? 0) *
        (container.readinessProbe?.failureThreshold ?? 0),
    });
  return startDateTime < DateTime.now();
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

const readinessProbeProposedFixes = (pod: Pod): ProposedFix | undefined => {
  const firstUnreadyContainerStatus = pod.status?.containerStatuses?.find(
    cs => {
      return cs.ready === false;
    },
  );

  return {
    errorType: 'ReadinessProbeFailed',
    rootCauseExplanation: `The container ${firstUnreadyContainerStatus?.name} failed to start properly, but is not crashing`,
    actions: [
      'Ensure that the container starts correctly locally',
      "Check the container's logs looking for error during startup",
    ],
    type: 'events',
    podName: pod.metadata?.name ?? '',
  };
};

const restartingPodProposedFixes = (pod: Pod): ProposedFix | undefined => {
  const lastTerminatedCs = (pod.status?.containerStatuses ?? []).find(
    cs => cs.lastState?.terminated !== undefined,
  );

  const lastTerminated = lastTerminatedCs?.lastState?.terminated;

  if (!lastTerminated) {
    return undefined;
  }

  switch (lastTerminated?.reason) {
    case 'Unknown':
      return {
        // TODO check this one, it's more likely a cluster issue
        errorType: 'Unknown',
        rootCauseExplanation: `This container has exited with a non-zero exit code (${lastTerminated.exitCode})`,
        actions: ['Check the crash logs for stacktraces'],
        container: lastTerminatedCs.name,
        type: 'logs',
      };
    case 'Error':
      return {
        errorType: 'Error',
        rootCauseExplanation: `This container has exited with a non-zero exit code (${lastTerminated.exitCode})`,
        actions: ['Check the crash logs for stacktraces'],
        container: lastTerminatedCs.name,
        type: 'logs',
      };
    case 'OOMKilled':
      return {
        errorType: 'OOMKilled',
        rootCauseExplanation: `The container "${lastTerminatedCs.name}" has crashed because it has tried to use more memory that it has been allocated`,
        actions: [
          `Increase the amount of memory assigned to the container`,
          'Ensure the application is memory bounded and is not trying to consume too much memory',
        ],
        docsLink:
          'https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/#exceed-a-container-s-memory-limit',
        type: 'docs',
      };
    default:
      return undefined;
  }
};

const waitingProposedFix = (pod: Pod): ProposedFix | undefined => {
  const waitingCs = (pod.status?.containerStatuses ?? []).find(
    cs => cs.state?.waiting !== undefined,
  );

  const waiting = (pod.status?.containerStatuses ?? [])
    .map(cs => cs.state?.waiting)
    .find(w => w?.reason !== undefined);

  switch (waiting?.reason) {
    case 'InvalidImageName':
      return {
        errorType: 'InvalidImageName',
        rootCauseExplanation: 'The image in the pod is invalid',
        actions: ['Ensure the image name is correct and valid image name'],
        type: 'docs',
        docsLink:
          'https://docs.docker.com/engine/reference/commandline/tag/#extended-description',
      };
    case 'ImagePullBackOff':
      return {
        errorType: 'ImagePullBackOff',
        rootCauseExplanation:
          'The image either could not be found or Kubernetes does not have permission to pull it',
        actions: [
          'Ensure the image name is correct',
          'Ensure Kubernetes has permission to pull this image',
        ],
        type: 'docs',
        docsLink:
          'https://kubernetes.io/docs/concepts/containers/images/#imagepullbackoff',
      };
    case 'CrashLoopBackOff':
      return {
        errorType: 'CrashLoopBackOff',
        rootCauseExplanation: `The container ${waitingCs?.name} has crashed many times, it will be exponentially restarted until it stops crashing`,
        actions: ['Check the crash logs for stacktraces'],
        type: 'logs',
        container: waitingCs?.name ?? 'unknown',
      };
    case 'CreateContainerConfigError':
      return {
        errorType: 'CreateContainerConfigError',
        rootCauseExplanation:
          'There is missing or mismatching configuration required to start the container',
        actions: [
          'Ensure ConfigMaps references in the Deployment manifest are correct and the keys exist',
          'Ensure Secrets references in the Deployment manifest are correct and the keys exist',
        ],
        type: 'docs',
        docsLink:
          'https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/',
      };
    default:
      return undefined;
  }
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
          proposedFix: readinessProbeProposedFixes(pod),
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
          proposedFix: waitingProposedFix(pod),
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
          proposedFix: restartingPodProposedFixes(pod),
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
