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

import { ReactNode } from 'react';
import { GroupedResponsesContext } from './GroupedResponses';
import { PodNamesWithErrorsContext } from './PodNamesWithErrors';
import {
  ClientPodStatus,
  ClusterAttributes,
} from '@backstage/plugin-kubernetes-common';
import { PodMetricsContext } from './usePodMetrics';
import { ClusterContext } from './Cluster';

export const kubernetesProviders = (
  groupedResponses: any = undefined,
  podsWithErrors: Set<string> = new Set<string>(),
  podNameToMetrics: Map<string, ClientPodStatus[]> = new Map<
    string,
    ClientPodStatus[]
  >(),
  cluster: ClusterAttributes = { name: 'some-cluster' },
) => {
  return (node: ReactNode) => (
    <ClusterContext.Provider value={cluster}>
      <GroupedResponsesContext.Provider value={groupedResponses}>
        <PodMetricsContext.Provider value={podNameToMetrics}>
          <PodNamesWithErrorsContext.Provider value={podsWithErrors}>
            {node}
          </PodNamesWithErrorsContext.Provider>
        </PodMetricsContext.Provider>
      </GroupedResponsesContext.Provider>
    </ClusterContext.Provider>
  );
};
