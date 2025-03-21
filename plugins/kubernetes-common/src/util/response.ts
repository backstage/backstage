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

import { FetchResponse } from '@backstage/plugin-kubernetes-common';
import { GroupedResponses } from '../types';

/** @public */
export const groupResponses = (
  fetchResponse: FetchResponse[],
): GroupedResponses => {
  // TODO this could probably be a lodash groupBy
  return fetchResponse.reduce(
    (prev, next) => {
      switch (next.type) {
        case 'deployments':
          prev.deployments.push(...next.resources);
          break;
        case 'pods':
          prev.pods.push(...next.resources);
          break;
        case 'replicasets':
          prev.replicaSets.push(...next.resources);
          break;
        case 'services':
          prev.services.push(...next.resources);
          break;
        case 'configmaps':
          prev.configMaps.push(...next.resources);
          break;
        case 'horizontalpodautoscalers':
          prev.horizontalPodAutoscalers.push(...next.resources);
          break;
        case 'ingresses':
          prev.ingresses.push(...next.resources);
          break;
        case 'jobs':
          prev.jobs.push(...next.resources);
          break;
        case 'cronjobs':
          prev.cronJobs.push(...next.resources);
          break;
        case 'customresources':
          prev.customResources.push(...next.resources);
          break;
        case 'statefulsets':
          prev.statefulsets.push(...next.resources);
          break;
        case 'daemonsets':
          prev.daemonSets.push(...next.resources);
          break;
        default:
      }
      return prev;
    },
    {
      pods: [],
      replicaSets: [],
      deployments: [],
      services: [],
      configMaps: [],
      horizontalPodAutoscalers: [],
      ingresses: [],
      jobs: [],
      cronJobs: [],
      customResources: [],
      statefulsets: [],
      daemonSets: [],
    } as GroupedResponses,
  );
};
