/*
 * Copyright 2020 Spotify AB
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

import { V1Pod, V1Deployment } from '@kubernetes/client-node';
import { DetectedError, ErrorSeverity } from '../types/types';
import { ObjectsByEntityResponse } from '@backstage/plugin-kubernetes-backend';
import { groupResponses } from './response';
import { totalRestarts } from './pod';

interface ErrorMapper<T extends Detectable> {
  severity: ErrorSeverity;
  errorExplanation: string;
  errorExists: (object: T) => boolean;
  messageAccessor: (object: T) => string[];
}

const podErrorMappers: ErrorMapper<V1Pod>[] = [
  {
    // this is probably pretty important
    severity: 5,
    errorExplanation: 'status-message',
    errorExists: pod => {
      return pod.status?.message !== undefined;
    },
    messageAccessor: pod => {
      return [pod.status?.message ?? ''];
    },
  },
  {
    // this may or may not be that important
    severity: 4,
    errorExplanation: 'containers-restarting',
    errorExists: pod => {
      // TODO magic number
      return totalRestarts(pod) > 3;
    },
    messageAccessor: pod => {
      return (pod.status?.containerStatuses ?? [])
        .filter(cs => cs.restartCount > 0)
        .map(cs => `container=${cs.name} restarted ${cs.restartCount} times`);
    },
  },
  {
    // this is probably pretty important
    severity: 5,
    errorExplanation: 'condition-message-present',
    errorExists: pod => {
      return (pod.status?.conditions ?? []).some(c => c.message !== undefined);
    },
    messageAccessor: pod => {
      return (pod.status?.conditions ?? [])
        .filter(c => c.message !== undefined)
        .map(c => c.message ?? '');
    },
  },
  {
    // this is probably pretty
    severity: 6,
    errorExplanation: 'container-waiting',
    errorExists: pod => {
      return (pod.status?.containerStatuses ?? []).some(
        cs => cs.state?.waiting?.message !== undefined,
      );
    },
    messageAccessor: pod => {
      return (pod.status?.containerStatuses ?? []).map(
        cs => cs.state?.waiting?.message ?? '',
      );
    },
  },
];

const deploymentErrorMappers: ErrorMapper<V1Deployment>[] = [
  {
    // this is probably important
    severity: 6,
    errorExplanation: 'condition-message-present',
    errorExists: deployment => {
      return (deployment.status?.conditions ?? [])
        .filter(c => c.status === 'False')
        .some(c => c.message !== undefined);
    },
    messageAccessor: deployment => {
      return (deployment.status?.conditions ?? [])
        .filter(c => c.status === 'False')
        .filter(c => c.message !== undefined)
        .map(c => c.message ?? '');
    },
  },
];

type Detectable = V1Pod | V1Deployment;

const detectErrorsInObjects = <T extends Detectable>(
  objects: T[],
  kind: string,
  clusterName: string,
  errorMappers: ErrorMapper<T>[],
): DetectedError[] => {
  const errors = new Map<string, DetectedError>();

  for (const object of objects) {
    for (const errorMapper of errorMappers) {
      if (errorMapper.errorExists(object)) {
        const message = errorMapper.messageAccessor(object);

        const joinedMessage = message.join('');

        const value = errors.get(joinedMessage);

        if (value !== undefined) {
          value.duplicateCount++;
          errors.set(joinedMessage, value);
        } else {
          errors.set(joinedMessage, {
            cluster: clusterName,
            kind: kind,
            name: object.metadata?.name ?? 'unknown',
            message: message,
            severity: errorMapper.severity,
            duplicateCount: 0,
          });
        }
      }
    }
  }

  return Array.from(errors.values());
};

const detectErrorsInPods = (
  pods: V1Pod[],
  clusterName: string,
): DetectedError[] =>
  detectErrorsInObjects(pods, 'Pod', clusterName, podErrorMappers);

const detectErrorsInDeployments = (
  deployments: V1Deployment[],
  clusterName: string,
): DetectedError[] =>
  detectErrorsInObjects(
    deployments,
    'Deployment',
    clusterName,
    deploymentErrorMappers,
  );

export const detectErrors = (
  objects: ObjectsByEntityResponse,
): DetectedError[] => {
  let errors: DetectedError[] = [];

  for (const clusterResponse of objects.items) {
    const groupedResponses = groupResponses(clusterResponse.resources);

    errors = errors.concat(
      detectErrorsInPods(groupedResponses.pods, clusterResponse.cluster.name),
    );
    errors = errors.concat(
      detectErrorsInDeployments(
        groupedResponses.deployments,
        clusterResponse.cluster.name,
      ),
    );
  }

  return errors.sort((a, b) => {
    if (a.severity < b.severity) {
      return 1;
    } else if (b.severity < a.severity) {
      return -1;
    }
    return 0;
  });
};
