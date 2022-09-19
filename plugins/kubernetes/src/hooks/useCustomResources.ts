/*
 * Copyright 2022 The Backstage Authors
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
import { useEffect, useState } from 'react';
import useInterval from 'react-use/lib/useInterval';
import { CustomResourceMatcher } from '@backstage/plugin-kubernetes-common';
import { useApi } from '@backstage/core-plugin-api';
import { KubernetesObjects } from './useKubernetesObjects';
import { generateAuth } from './auth';

export const useCustomResources = (
  entity: Entity,
  customResourceMatchers: CustomResourceMatcher[],
  intervalMs: number = 10000,
): KubernetesObjects => {
  const kubernetesApi = useApi(kubernetesApiRef);
  const kubernetesAuthProvidersApi = useApi(kubernetesAuthProvidersApiRef);
  const [result, setResult] = useState<KubernetesObjects>({
    kubernetesObjects: undefined,
    error: undefined,
  });

  const getObjects = async () => {
    try {
      const auth = await generateAuth(
        entity,
        kubernetesApi,
        kubernetesAuthProvidersApi,
      );
      const objects = await kubernetesApi.getCustomObjectsByEntity(
        auth,
        customResourceMatchers,
        entity,
      );
      setResult({ kubernetesObjects: objects });
    } catch (e) {
      setResult({ error: e.message });
      return;
    }
  };

  useEffect(() => {
    getObjects();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [entity.metadata.name, kubernetesApi, generateAuth]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useInterval(() => {
    getObjects();
  }, intervalMs);

  return result;
};
