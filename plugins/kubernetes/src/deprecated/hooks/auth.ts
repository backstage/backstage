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
import { KubernetesApi } from '../api/types';
import { KubernetesAuthProvidersApi } from '../kubernetes-auth-provider/types';
import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';

export const generateAuth = async (
  entity: Entity,
  kubernetesApi: KubernetesApi,
  kubernetesAuthProvidersApi: KubernetesAuthProvidersApi,
) => {
  const clusters = await kubernetesApi.getClusters();

  const authProviders: string[] = [
    ...new Set(
      clusters.map(
        c =>
          `${c.authProvider}${
            c.oidcTokenProvider ? `.${c.oidcTokenProvider}` : ''
          }`,
      ),
    ),
  ];

  let requestBody: KubernetesRequestBody = {
    entity,
  };
  for (const authProviderStr of authProviders) {
    requestBody = await kubernetesAuthProvidersApi.decorateRequestBodyForAuth(
      authProviderStr,
      requestBody,
    );
  }
  return requestBody.auth ?? {};
};
