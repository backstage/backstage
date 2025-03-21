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

import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';
import { createApiRef } from '@backstage/core-plugin-api';

/** @public */
export interface KubernetesAuthProvider {
  decorateRequestBodyForAuth(
    requestBody: KubernetesRequestBody,
  ): Promise<KubernetesRequestBody>;
  getCredentials(): Promise<{ token?: string }>;
}

/** @public */
export const kubernetesAuthProvidersApiRef =
  createApiRef<KubernetesAuthProvidersApi>({
    id: 'plugin.kubernetes-auth-providers.service',
  });

/** @public */
export interface KubernetesAuthProvidersApi {
  decorateRequestBodyForAuth(
    authProvider: string,
    requestBody: KubernetesRequestBody,
  ): Promise<KubernetesRequestBody>;
  getCredentials(authProvider: string): Promise<{ token?: string }>;
}
