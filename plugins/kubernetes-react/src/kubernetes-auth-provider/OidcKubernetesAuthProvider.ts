/*
 * Copyright 2025 The Backstage Authors
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
import { OpenIdConnectApi, OAuthApi } from '@backstage/core-plugin-api';
import { KubernetesAuthProvider } from './types';
import { useMicrosoftAccessTokenProvider } from '../hooks';

/** @public */
export class OidcKubernetesAuthProvider implements KubernetesAuthProvider {
  providerName: string;
  idTokenProviderApi: OpenIdConnectApi;
  accessTokenProviderApi?: OAuthApi;
  microsoftAccessTokenProviderScope = useMicrosoftAccessTokenProvider();
  constructor(
    providerName: string,
    idTokenProviderApi: OpenIdConnectApi,
    accessTokenProviderApi?: OAuthApi,
  ) {
    this.providerName = providerName;
    this.idTokenProviderApi = idTokenProviderApi;
    this.accessTokenProviderApi = accessTokenProviderApi || undefined;
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
    let token: string;

    if (this.providerName === 'microsoft' && this.accessTokenProviderApi) {
      token = await this.accessTokenProviderApi.getAccessToken(
        this.microsoftAccessTokenProviderScope,
      );
    } else {
      token = await this.idTokenProviderApi.getIdToken();
    }

    return {
      token,
    };
  }
}
