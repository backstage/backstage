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

import { JsonObject } from '@backstage/types';
import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';
import { OAuthApi, OpenIdConnectApi } from '@backstage/core-plugin-api';
import { KubernetesAuthProvider } from './types';

/** @public */
export class OidcKubernetesAuthProvider implements KubernetesAuthProvider {
  providerName: string;
  authProvider: OpenIdConnectApi;
  microsoftAuthApi: OAuthApi | undefined;

  constructor(
    providerName: string,
    authProvider: OpenIdConnectApi,
    microsoftAuthApi?: OAuthApi,
  ) {
    this.providerName = providerName;
    this.authProvider = authProvider;
    this.microsoftAuthApi = microsoftAuthApi;
  }

  async decorateRequestBodyForAuth(
    requestBody: KubernetesRequestBody,
  ): Promise<KubernetesRequestBody> {
    const authToken: string = (await this.getCredentials()).token;
    const auth = { ...(requestBody.auth as JsonObject) };
    if (auth.oidc) {
      (auth.oidc as JsonObject)[this.providerName] = authToken;
    } else {
      auth.oidc = { [this.providerName]: authToken };
    }
    requestBody.auth = auth;
    return requestBody;
  }

  async getCredentials(): Promise<{ token: string }> {
    if (this.microsoftAuthApi) {
      // static scope to preserve compatibility with the AKS auth Provider
      const token = await this.microsoftAuthApi.getAccessToken(
        '67f5fed8-2d97-45fc-9f0e-cf1ef6fc1f03/user.read',
      );

      return {
        token,
      };
    }

    const token = await this.authProvider.getIdToken();

    return {
      token,
    };
  }
}
