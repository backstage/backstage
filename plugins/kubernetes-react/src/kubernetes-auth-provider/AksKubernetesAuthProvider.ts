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
import { OAuthApi } from '@backstage/core-plugin-api';
import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';
import { KubernetesAuthProvider } from './types';

/** @public */
export class AksKubernetesAuthProvider implements KubernetesAuthProvider {
  constructor(private readonly microsoftAuthApi: OAuthApi) {}

  async decorateRequestBodyForAuth(
    requestBody: KubernetesRequestBody,
  ): Promise<KubernetesRequestBody> {
    return {
      ...requestBody,
      auth: { ...requestBody.auth, aks: (await this.getCredentials()).token },
    };
  }

  async getCredentials(): Promise<{ token?: string }> {
    return {
      token: await this.microsoftAuthApi.getAccessToken(
        '6dae42f8-4368-4678-94ff-3960e28e3630/user.read',
      ),
    };
  }
}
