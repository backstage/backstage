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

import { DetectedError, ErrorMapper } from './types';
import { Deployment } from 'kubernetes-models/apps/v1';
import { detectErrorsInObjects } from './common';

const deploymentErrorMappers: ErrorMapper<Deployment>[] = [
  {
    detectErrors: deployment => {
      return (deployment.status?.conditions ?? [])
        .filter(c => c.status === 'False')
        .filter(c => c.message !== undefined)
        .map(c => ({
          type: 'condition-message-present',
          message: c.message ?? '',
          severity: 6,
          sourceRef: {
            name: deployment.metadata?.name ?? 'unknown hpa',
            namespace: deployment.metadata?.namespace ?? 'unknown namespace',
            kind: 'Deployment',
            apiGroup: 'apps/v1',
          },
          occuranceCount: 1,
        }));
    },
  },
];

export const detectErrorsInDeployments = (
  deployments: Deployment[],
): DetectedError[] =>
  detectErrorsInObjects(deployments, deploymentErrorMappers);
