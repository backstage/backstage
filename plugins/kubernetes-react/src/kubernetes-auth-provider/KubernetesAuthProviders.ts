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
import { KubernetesAuthProvider, KubernetesAuthProvidersApi } from './types';
import { GoogleKubernetesAuthProvider } from './GoogleKubernetesAuthProvider';
import { ServerSideKubernetesAuthProvider } from './ServerSideAuthProvider';
import { OAuthApi, OpenIdConnectApi } from '@backstage/core-plugin-api';
import { OidcKubernetesAuthProvider } from './OidcKubernetesAuthProvider';
import { AksKubernetesAuthProvider } from './AksKubernetesAuthProvider';

/** @public */
export class KubernetesAuthProviders implements KubernetesAuthProvidersApi {
  private readonly kubernetesAuthProviderMap: Map<
    string,
    KubernetesAuthProvider
  >;

  constructor(options: {
    microsoftAuthApi: OAuthApi;
    googleAuthApi: OAuthApi;
    oidcProviders?: { [key: string]: OpenIdConnectApi };
  }) {
    this.kubernetesAuthProviderMap = new Map<string, KubernetesAuthProvider>();
    this.kubernetesAuthProviderMap.set(
      'google',
      new GoogleKubernetesAuthProvider(options.googleAuthApi),
    );
    this.kubernetesAuthProviderMap.set(
      'serviceAccount',
      new ServerSideKubernetesAuthProvider(),
    );
    this.kubernetesAuthProviderMap.set(
      'googleServiceAccount',
      new ServerSideKubernetesAuthProvider(),
    );
    this.kubernetesAuthProviderMap.set(
      'aws',
      new ServerSideKubernetesAuthProvider(),
    );
    this.kubernetesAuthProviderMap.set(
      'azure',
      new ServerSideKubernetesAuthProvider(),
    );
    this.kubernetesAuthProviderMap.set(
      'localKubectlProxy',
      new ServerSideKubernetesAuthProvider(),
    );
    this.kubernetesAuthProviderMap.set(
      'aks',
      new AksKubernetesAuthProvider(options.microsoftAuthApi),
    );

    if (options.oidcProviders) {
      Object.keys(options.oidcProviders).forEach(provider => {
        this.kubernetesAuthProviderMap.set(
          `oidc.${provider}`,
          new OidcKubernetesAuthProvider(
            provider,
            options.oidcProviders![provider],
          ),
        );
      });
    }
  }

  async decorateRequestBodyForAuth(
    authProvider: string,
    requestBody: KubernetesRequestBody,
  ): Promise<KubernetesRequestBody> {
    const kubernetesAuthProvider: KubernetesAuthProvider | undefined =
      this.kubernetesAuthProviderMap.get(authProvider);
    if (kubernetesAuthProvider) {
      return await kubernetesAuthProvider.decorateRequestBodyForAuth(
        requestBody,
      );
    }

    if (authProvider.startsWith('oidc.')) {
      throw new Error(
        `KubernetesAuthProviders has no oidcProvider configured for ${authProvider}`,
      );
    }
    throw new Error(
      `authProvider "${authProvider}" has no KubernetesAuthProvider defined for it`,
    );
  }

  async getCredentials(authProvider: string): Promise<{ token?: string }> {
    const kubernetesAuthProvider: KubernetesAuthProvider | undefined =
      this.kubernetesAuthProviderMap.get(authProvider);

    if (kubernetesAuthProvider) {
      return await kubernetesAuthProvider.getCredentials();
    }

    if (authProvider.startsWith('oidc.')) {
      throw new Error(
        `KubernetesAuthProviders has no oidcProvider configured for ${authProvider}`,
      );
    }
    throw new Error(
      `authProvider "${authProvider}" has no KubernetesAuthProvider defined for it`,
    );
  }
}
