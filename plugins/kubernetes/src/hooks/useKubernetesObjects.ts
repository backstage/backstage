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

import { Entity } from '@backstage/catalog-model';
import { kubernetesApiRef } from '../api/types';
import { kubernetesAuthProvidersApiRef } from '../kubernetes-auth-provider/types';
import { useCallback } from 'react';
import useInterval from 'react-use/lib/useInterval';
import { ObjectsByEntityResponse } from '@backstage/plugin-kubernetes-common';
import { useApi } from '@backstage/core-plugin-api';
import { generateAuth } from './auth';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';

export interface KubernetesObjects {
  kubernetesObjects?: ObjectsByEntityResponse;
  loading: boolean;
  error?: string;
}

export const useKubernetesObjects = (
  entity: Entity,
  intervalMs: number = 10000,
): KubernetesObjects => {
  const kubernetesApi = useApi(kubernetesApiRef);
  const kubernetesAuthProvidersApi = useApi(kubernetesAuthProvidersApiRef);
  const getObjects = useCallback(async (): Promise<ObjectsByEntityResponse> => {
    const auth = await generateAuth(
      entity,
      kubernetesApi,
      kubernetesAuthProvidersApi,
    );
    return await kubernetesApi.getObjectsByEntity({
      auth,
      entity,
    });
  }, [kubernetesApi, entity, kubernetesAuthProvidersApi]);

  const { value, loading, error, retry } = useAsyncRetry(
    () => getObjects(),
    [getObjects],
  );

  useInterval(() => retry(), intervalMs);

  return {
    kubernetesObjects: value,
    loading,
    error: error?.message,
  };
};
