/*
 * Copyright 2023 The Backstage Authors
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
import useAsync from 'react-use/esm/useAsync';

import { ContainerScope } from './types';
import { useApi } from '@backstage/core-plugin-api';
import { kubernetesProxyApiRef } from '../../../api/types';

/**
 * Arguments for usePodLogs
 *
 * @public
 */
export interface PodLogsOptions {
  containerScope: ContainerScope;
  previous?: boolean;
}

/**
 * Retrieves the logs for the given pod
 *
 * @public
 */
export const usePodLogs = ({ containerScope, previous }: PodLogsOptions) => {
  const kubernetesProxyApi = useApi(kubernetesProxyApiRef);
  return useAsync(async () => {
    return await kubernetesProxyApi.getPodLogs({
      podName: containerScope.podName,
      namespace: containerScope.podNamespace,
      containerName: containerScope.containerName,
      clusterName: containerScope.cluster.name,
      previous,
    });
  }, [JSON.stringify(containerScope)]);
};
