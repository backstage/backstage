/*
 * Copyright 2024 The Backstage Authors
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
import useAsync from 'react-use/lib/useAsync';

import { PodScope } from './types';
import { useApi } from '@backstage/core-plugin-api';
import { kubernetesProxyApiRef } from '../../../api/types';

/**
 * Arguments for usePodDelete
 *
 * @public
 */
export interface PodDeleteOptions {
  podScope: PodScope;
}

/**
 * Delete a given pod
 *
 * @public
 */
export const usePodDelete = ({ podScope }: PodDeleteOptions) => {
  const kubernetesProxyApi = useApi(kubernetesProxyApiRef);
  return useAsync(async () => {
    return await kubernetesProxyApi.deletePod({
      podName: podScope.podName,
      namespace: podScope.podNamespace,
      clusterName: podScope.cluster.name,
    });
  }, [JSON.stringify(podScope)]);
};
