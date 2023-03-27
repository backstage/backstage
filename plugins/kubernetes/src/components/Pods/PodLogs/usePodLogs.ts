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
import {
  kubernetesApiRef,
  kubernetesAuthProvidersApiRef,
} from '@backstage/plugin-kubernetes';
import useAsync from 'react-use/lib/useAsync';

import { ContainerLogContext } from './types';
import { useApi } from '@backstage/core-plugin-api';
import { generateAuth } from '../../../hooks/auth';
import { useEntity } from '@backstage/plugin-catalog-react';

interface PodLogsOptions {
  logContext: ContainerLogContext;
  previous?: boolean;
}

export const usePodLogs = ({ logContext, previous }: PodLogsOptions) => {
  const kubernetesApi = useApi(kubernetesApiRef);
  const kubernetesAuthProvidersApi = useApi(kubernetesAuthProvidersApiRef);
  const { entity } = useEntity();
  return useAsync(async () => {
    const auth = await generateAuth(
      entity,
      kubernetesApi,
      kubernetesAuthProvidersApi,
    );

    // TODO fix hardcoding
    const token = auth.google ?? '';
    return await kubernetesApi.getPodLogs({
      podName: logContext.podName,
      namespace: logContext.podNamespace,
      containerName: logContext.containerName,
      clusterName: logContext.clusterName,
      token: token,
    });
  }, [JSON.stringify(logContext), previous]);
};
