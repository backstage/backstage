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
import { useApi } from '@backstage/core-plugin-api';
import useAsync, { AsyncState } from 'react-use/lib/useAsync';

import { kubernetesApiRef } from '../api/types';

/**
 * Check if conditions for a pod exec call through the proxy endpoint are met
 *
 * @internal
 */
export const useIsPodExecTerminalSupported = (): AsyncState<boolean> => {
  const kubernetesApi = useApi(kubernetesApiRef);

  return useAsync(async () => {
    const clusters = await kubernetesApi.getClusters();

    if (clusters.length !== 1) {
      return false;
    }

    const { authProvider } = clusters[0];
    const isClientAuthProvider = ['aks', 'google', 'oidc'].some(
      authProviderName => authProvider.includes(authProviderName),
    );

    return !isClientAuthProvider;
  });
};
